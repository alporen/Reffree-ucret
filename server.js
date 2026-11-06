'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sqlite = require('node:sqlite');
const Database = sqlite.Database || sqlite.DatabaseSync;

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.resolve(process.env.HAKEM_DATA_DIR || path.join(ROOT, 'data'));
const DB_PATH = path.join(DATA_DIR, 'hakem.sqlite');
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const rates = JSON.parse(fs.readFileSync(path.join(ROOT, 'rates.json'), 'utf8'));
const typeById = new Map(rates.types.map(type => [type.id, type]));
const roles = new Set(Object.keys(rates.roles));

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new Database(DB_PATH, { timeout: 5000 });
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
  CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    type_id TEXT NOT NULL,
    role TEXT NOT NULL,
    second INTEGER NOT NULL DEFAULT 0,
    location_type TEXT NOT NULL DEFAULT 'home',
    distance_band TEXT NOT NULL DEFAULT '0',
    match_fee REAL NOT NULL,
    travel_fee REAL NOT NULL,
    allowance REAL NOT NULL,
    total REAL NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS matches_user_date_idx ON matches(user_id, date);
`);

// This is a local, single-user app. Keep the existing account/match schema so
// old SQLite files remain readable, but no account or session is required.
const existingOwner = db.prepare(`
  SELECT id FROM users ORDER BY CASE role WHEN 'admin' THEN 0 ELSE 1 END, created_at, id LIMIT 1
`).get();
let LOCAL_USER_ID = existingOwner?.id;
if (!LOCAL_USER_ID) {
  const created = db.prepare(`
    INSERT INTO users(username, password_salt, password_hash, role, created_at)
    VALUES (?, ?, ?, 'admin', ?)
  `).run('yerel_kullanici', crypto.randomBytes(16).toString('hex'), crypto.randomBytes(64).toString('hex'), new Date().toISOString());
  LOCAL_USER_ID = Number(created.lastInsertRowid);
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function json(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://cdn.sheetjs.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
}

function assertSameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) throw new HttpError(403, 'İstek kaynağı doğrulanamadı.');
  try {
    if (new URL(origin).host.toLowerCase() !== host.toLowerCase()) throw new HttpError(403, 'İstek kaynağı doğrulanamadı.');
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(403, 'İstek kaynağı doğrulanamadı.');
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > 1024 * 1024) {
        reject(new HttpError(413, 'İstek boyutu çok büyük.'));
        req.resume();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (!size) return resolve({});
      if (!String(req.headers['content-type'] || '').toLowerCase().includes('application/json')) {
        return reject(new HttpError(415, 'JSON içerik türü gerekli.'));
      }
      try {
        const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Nesne bekleniyor');
        resolve(value);
      } catch {
        reject(new HttpError(400, 'İstek gövdesi geçerli JSON değil.'));
      }
    });
    req.on('error', reject);
  });
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function amount(value, fieldName) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 1000000) throw new HttpError(400, `${fieldName} geçerli bir tutar olmalı.`);
  return roundMoney(number);
}

function normalizeMatch(input, preserveFee = false) {
  if (!input || typeof input !== 'object') throw new HttpError(400, 'Maç bilgileri eksik.');
  const date = input.date;
  const parsedDate = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00.000Z`) : null;
  if (!parsedDate || !Number.isFinite(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    throw new HttpError(400, 'Geçerli bir maç tarihi girin.');
  }
  const type = typeById.get(input.typeId);
  if (!type || !roles.has(input.role)) throw new HttpError(400, 'Maç türü veya görev seçimi geçersiz.');
  if (input.locationType !== undefined && !['home', 'away'].includes(input.locationType)) throw new HttpError(400, 'Görev yeri seçimi geçersiz.');
  const second = input.second === true || input.second === 1;
  const distanceBand = String(input.distanceBand ?? '0');
  if (!['0', ...Object.keys(rates.travelRates)].includes(distanceBand)) throw new HttpError(400, 'Yol mesafesi seçimi geçersiz.');
  const matchFee = preserveFee ? amount(input.matchFee, 'Maç ücreti') : type.fees[input.role];
  const travelFee = second ? 0 : amount(input.travelFee ?? 0, 'Yol ücreti');
  const allowance = second || !type.allowance ? 0 : amount(input.allowance ?? 0, 'Harcırah');
  return {
    id: crypto.randomUUID(), date, typeId: type.id, role: input.role, second,
    locationType: input.locationType === 'away' ? 'away' : 'home', distanceBand,
    matchFee, travelFee, allowance, total: roundMoney(matchFee + travelFee + allowance)
  };
}

function dbMatch(row) {
  return {
    id: row.id, date: row.date, typeId: row.type_id, role: row.role,
    second: Boolean(row.second), locationType: row.location_type,
    distanceBand: row.distance_band, matchFee: row.match_fee,
    travelFee: row.travel_fee, allowance: row.allowance, total: row.total
  };
}

function insertMatch(userId, match) {
  const now = new Date().toISOString();
  db.prepare(`INSERT INTO matches
    (id, user_id, date, type_id, role, second, location_type, distance_band, match_fee, travel_fee, allowance, total, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(match.id, userId, match.date, match.typeId, match.role, Number(match.second), match.locationType,
      match.distanceBand, match.matchFee, match.travelFee, match.allowance, match.total, now, now);
}

function getAllMatches() {
  return db.prepare('SELECT * FROM matches ORDER BY date, created_at').all().map(dbMatch);
}

function transaction(action) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = action();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

async function handleApi(req, res, url) {
  const pathname = url.pathname;
  if (req.method === 'GET' && pathname === '/api/health') return json(res, 200, { ok: true });
  if (req.method === 'GET' && pathname === '/api/config') return json(res, 200, rates);

  if (req.method === 'GET' && pathname === '/api/matches') return json(res, 200, { matches: getAllMatches() });

  if (req.method === 'POST' && pathname === '/api/matches') {
    assertSameOrigin(req);
    const match = normalizeMatch(await readJson(req));
    insertMatch(LOCAL_USER_ID, match);
    return json(res, 201, { match });
  }

  if (req.method === 'POST' && pathname === '/api/matches/import') {
    assertSameOrigin(req);
    const body = await readJson(req);
    if (!Array.isArray(body.records) || body.records.length > 5000) throw new HttpError(400, 'En fazla 5.000 eski kayıt aktarılabilir.');
    const count = db.prepare('SELECT COUNT(*) AS count FROM matches').get().count;
    if (count > 0) throw new HttpError(409, 'Bu uygulamada zaten maç kaydı var; toplu aktarım yalnızca boş veritabanında yapılabilir.');
    const imported = transaction(() => {
      for (const item of body.records) insertMatch(LOCAL_USER_ID, normalizeMatch(item, true));
      return body.records.length;
    });
    return json(res, 201, { imported });
  }

  const matchRoute = pathname.match(/^\/api\/matches\/([^/]+)$/);
  if (matchRoute && req.method === 'PUT') {
    assertSameOrigin(req);
    const id = decodeURIComponent(matchRoute[1]);
    const match = normalizeMatch(await readJson(req));
    const result = db.prepare(`UPDATE matches SET date=?, type_id=?, role=?, second=?, location_type=?, distance_band=?,
      match_fee=?, travel_fee=?, allowance=?, total=?, updated_at=? WHERE id=?`)
      .run(match.date, match.typeId, match.role, Number(match.second), match.locationType, match.distanceBand,
        match.matchFee, match.travelFee, match.allowance, match.total, new Date().toISOString(), id);
    if (!result.changes) throw new HttpError(404, 'Maç kaydı bulunamadı.');
    return json(res, 200, { match: { ...match, id } });
  }
  if (matchRoute && req.method === 'DELETE') {
    assertSameOrigin(req);
    const id = decodeURIComponent(matchRoute[1]);
    const result = db.prepare('DELETE FROM matches WHERE id = ?').run(id);
    if (!result.changes) throw new HttpError(404, 'Maç kaydı bulunamadı.');
    return json(res, 200, { ok: true });
  }

  if (req.method === 'POST' && pathname === '/api/season/reset') {
    assertSameOrigin(req);
    const body = await readJson(req);
    if (body.confirmation !== 'SIFIRLA') throw new HttpError(400, 'Onay alanına SIFIRLA yazın.');
    const result = db.prepare('DELETE FROM matches').run();
    return json(res, 200, { deleted: Number(result.changes) });
  }

  throw new HttpError(404, 'İstek bulunamadı.');
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon'
};

async function serveStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') throw new HttpError(405, 'Bu istek yöntemi desteklenmiyor.');
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { throw new HttpError(400, 'Adres geçersiz.'); }
  if (decoded === '/') decoded = '/index.html';
  const filePath = path.resolve(PUBLIC_DIR, `.${decoded}`);
  if (!filePath.startsWith(PUBLIC_DIR + path.sep)) throw new HttpError(404, 'Dosya bulunamadı.');
  let stat;
  try { stat = await fs.promises.stat(filePath); } catch { throw new HttpError(404, 'Dosya bulunamadı.'); }
  if (!stat.isFile()) throw new HttpError(404, 'Dosya bulunamadı.');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  setSecurityHeaders(res);
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) await handleApi(req, res, url);
    else await serveStatic(req, res, url.pathname);
  } catch (error) {
    if (res.headersSent) return res.end();
    const status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error('İstek işlenemedi:', error.message);
    json(res, status, { error: status === 500 ? 'Sunucu hatası oluştu.' : error.message });
  }
});

function start() {
  server.listen(PORT, HOST, () => {
    console.log(`Hakem Ücret Takibi çalışıyor: http://localhost:${PORT}`);
    console.log(`Veritabanı: ${DB_PATH}`);
  });
  return server;
}

function close() {
  return new Promise(resolve => {
    if (!server.listening) {
      db.close();
      resolve();
      return;
    }
    server.close(() => {
      db.close();
      resolve();
    });
  });
}

if (require.main === module) {
  start();
  process.on('SIGINT', () => close().then(() => process.exit(0)));
  process.on('SIGTERM', () => close().then(() => process.exit(0)));
}

module.exports = { start, close, server };
