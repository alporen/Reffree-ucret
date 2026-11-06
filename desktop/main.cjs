'use strict';

const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');

app.setAppUserModelId('net.hakem.ucrettakibi');

let mainWindow;
let localServer;
let shutdownStarted = false;
let serverPort;
let preferencesPath;
let preferredTheme = 'light';

function loadPreferences(dataDirectory) {
  preferencesPath = path.join(dataDirectory, 'preferences.json');
  try {
    const preferences = JSON.parse(fs.readFileSync(preferencesPath, 'utf8'));
    if (preferences.theme === 'dark' || preferences.theme === 'light') preferredTheme = preferences.theme;
  } catch { /* İlk çalıştırmada açık tema kullanılır. */ }
}

ipcMain.handle('preferences:set-theme', (_event, theme) => {
  if (theme !== 'dark' && theme !== 'light') throw new Error('Tema tercihi geçersiz.');
  const temporaryPath = `${preferencesPath}.tmp`;
  fs.writeFileSync(temporaryPath, JSON.stringify({ theme }), 'utf8');
  fs.renameSync(temporaryPath, preferencesPath);
  preferredTheme = theme;
  return true;
});

function findFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(error => error ? reject(error) : resolve(port));
    });
  });
}

function getDataDirectory(appRoot) {
  const portableDirectory = process.env.PORTABLE_EXECUTABLE_DIR;
  const preferred = portableDirectory
    ? path.join(portableDirectory, 'data')
    : app.isPackaged
      ? path.join(app.getPath('userData'), 'data')
      : path.join(appRoot, 'data');

  try {
    fs.mkdirSync(preferred, { recursive: true });
    return preferred;
  } catch {
    const fallback = path.join(app.getPath('userData'), 'data');
    fs.mkdirSync(fallback, { recursive: true });
    return fallback;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 360,
    minHeight: 560,
    show: true,
    autoHideMenuBar: true,
    backgroundColor: preferredTheme === 'dark' ? '#0d171f' : '#f2f6f7',
    title: 'Hakem Ücret Takibi',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(app.getAppPath(), 'desktop', 'preload.cjs')
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, url) => {
    try {
      const target = new URL(url);
      if (target.origin !== `http://127.0.0.1:${serverPort}` || target.pathname !== '/') event.preventDefault();
    } catch { event.preventDefault(); }
  });
  mainWindow.loadURL(`http://127.0.0.1:${serverPort}/?theme=${preferredTheme}`);
  mainWindow.on('closed', () => { mainWindow = null; });
}

async function startApp() {
  const appRoot = app.getAppPath();
  const dataDirectory = getDataDirectory(appRoot);
  loadPreferences(dataDirectory);
  serverPort = await findFreePort();

  process.env.HOST = '127.0.0.1';
  process.env.PORT = String(serverPort);
  process.env.HAKEM_DATA_DIR = dataDirectory;
  process.env.NODE_ENV = 'desktop';

  const serverModule = require(path.join(appRoot, 'server.js'));
  localServer = serverModule;
  const server = serverModule.start();
  await new Promise((resolve, reject) => {
    if (server.listening) return resolve();
    server.once('listening', resolve);
    server.once('error', reject);
  });

  createWindow();
}

app.whenReady().then(startApp).catch(error => {
  dialog.showErrorBox('Hakem Ücret Takibi açılamadı', error.message || 'Uygulama başlatılırken hata oluştu.');
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0 && serverPort) createWindow();
});

app.on('window-all-closed', () => app.quit());

app.on('before-quit', event => {
  if (!localServer || shutdownStarted) return;
  event.preventDefault();
  shutdownStarted = true;
  localServer.close().finally(() => app.quit());
});
