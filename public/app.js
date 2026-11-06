(() => {
      const STORAGE_KEY = 'hakem-ucret-takibi-v1';
      const THEME_KEY = 'hakem-ucret-temasi-v1';
      const roles = { referee: 'Hakem', assistant: 'Yardımcı hakem', fourth: '4. hakem' };
      const types = [
        { id: 'paf_u19', label: 'PAF U19', level: 'En Yüksek', fees: { referee: 2200, assistant: 1300, fourth: 1040 }, allowance: true },
        { id: 'women_sl', label: 'Kadın SL', level: 'Yüksek', fees: { referee: 1620, assistant: 970, fourth: 810 }, allowance: true },
        { id: 'futsal', label: 'Futsal', level: 'Yüksek', fees: { referee: 1620, assistant: 970, fourth: 810 }, allowance: true },
        { id: 'beach', label: 'Plaj', level: 'Yüksek', fees: { referee: 1620, assistant: 970, fourth: 810 }, allowance: true },
        { id: 'sal', label: 'SAL', level: 'Orta-Yüksek', fees: { referee: 1300, assistant: 780, fourth: 650 }, allowance: true },
        { id: 'league_1k', label: '1K', level: 'Orta-Yüksek', fees: { referee: 1300, assistant: 780, fourth: 650 }, allowance: true },
        { id: 'league_2k', label: '2K', level: 'Orta-Yüksek', fees: { referee: 1300, assistant: 780, fourth: 650 }, allowance: true },
        { id: 'women_1', label: 'Kadınlar 1. Ligi', level: 'Orta-Yüksek', fees: { referee: 1300, assistant: 780, fourth: 650 }, allowance: true },
        { id: 'women_2', label: 'Kadınlar 2. Ligi', level: 'Orta-Yüksek', fees: { referee: 1300, assistant: 780, fourth: 650 }, allowance: true },
        { id: 'women_3', label: 'Kadınlar 3. Ligi', level: 'Orta-Yüksek', fees: { referee: 1300, assistant: 780, fourth: 650 }, allowance: true },
        { id: 'deaf', label: 'İşitme Engelliler', level: 'Orta', fees: { referee: 1165, assistant: 710, fourth: 585 }, allowance: true },
        { id: 'u19', label: 'U19', level: 'Orta', fees: { referee: 1165, assistant: 710, fourth: 585 }, allowance: true },
        { id: 'u18', label: 'U18', level: 'Orta', fees: { referee: 1165, assistant: 710, fourth: 585 }, allowance: true },
        { id: 'u17', label: 'U17', level: 'Orta', fees: { referee: 1165, assistant: 710, fourth: 585 }, allowance: true },
        { id: 'u16', label: 'U16', level: 'Orta', fees: { referee: 1165, assistant: 710, fourth: 585 }, allowance: true },
        { id: 'u15', label: 'U15', level: 'Orta', fees: { referee: 1165, assistant: 710, fourth: 585 }, allowance: true },
        { id: 'u14', label: 'U14', level: 'Orta-Düşük', fees: { referee: 1040, assistant: 650, fourth: 520 }, allowance: true },
        { id: 'u13', label: 'U13', level: 'Orta-Düşük', fees: { referee: 1040, assistant: 650, fourth: 520 }, allowance: true },
        { id: 'u12', label: 'U12', level: 'Orta-Düşük', fees: { referee: 1040, assistant: 650, fourth: 520 }, allowance: true },
        { id: 'u11', label: 'U11', level: 'Orta-Düşük', fees: { referee: 1040, assistant: 650, fourth: 520 }, allowance: true },
        { id: 'u10_new', label: 'U10', level: 'Orta-Düşük', fees: { referee: 1040, assistant: 650, fourth: 520 }, allowance: true },
        { id: 'futsal_il', label: 'Futsal İl', level: 'Orta-Düşük', fees: { referee: 650, assistant: 450, fourth: 0 }, allowance: false },
        { id: 'beach_il', label: 'Plaj İl', level: 'Orta-Düşük', fees: { referee: 650, assistant: 450, fourth: 0 }, allowance: false },
        { id: 'indoor', label: 'Halı Saha', level: 'Orta-Düşük', fees: { referee: 650, assistant: 450, fourth: 0 }, allowance: false },
        { id: 'tournament', label: 'Özel Turnuvalar', level: 'En Düşük', fees: { referee: 650, assistant: 450, fourth: 0 }, allowance: false },
        { id: 'paf', label: 'PAF U19', fees: { referee: 2200, assistant: 1300, fourth: 1040 }, allowance: true, legacy: true },
        { id: 'women', label: 'Kadın SL / Futsal / Plaj (eski kayıt)', fees: { referee: 1620, assistant: 970, fourth: 810 }, allowance: true, legacy: true },
        { id: 'league', label: 'SAL / 1K / 2K / Kadınlar 1.–3. Ligi (eski kayıt)', fees: { referee: 1300, assistant: 780, fourth: 650 }, allowance: true, legacy: true },
        { id: 'youth', label: 'U15–U19 / İşitme Engelliler (eski kayıt)', fees: { referee: 1165, assistant: 710, fourth: 585 }, allowance: true, legacy: true },
        { id: 'u10', label: 'U10 / U11 / U12 / U13 / U14 (eski kayıt)', fees: { referee: 1040, assistant: 650, fourth: 520 }, allowance: true, legacy: true },
        { id: 'special', label: 'Futsal İl / Plaj İl / Halı Saha / Özel Turnuvalar (eski kayıt)', fees: { referee: 650, assistant: 450, fourth: 0 }, allowance: false, legacy: true }
      ];
      const travelRates = { 1: 460, 2: 550, 3: 650, 4: 830, 5: 1382, 6: 3202 };
      const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      const $ = (id) => document.getElementById(id);
      const form = $('matchForm');
      const dateInput = $('matchDate');
      const typeInput = $('matchType');
      const roleInput = $('role');
      const secondInput = $('secondMatch');
      const locationInput = $('locationType');
      const distanceInput = $('distanceBand');
      const travelInput = $('travelFee');
      const allowanceInput = $('allowance');
      let matches = [];
      let editingId = null;
      let toastTimer;
      let earningsChart = null;
      let categoryChart = null;
      let modalAnimation = null;
      let currentPage = 'home';
      let selectedMonthKey = null;

      for (const level of ['En Yüksek', 'Yüksek', 'Orta-Yüksek', 'Orta', 'Orta-Düşük', 'En Düşük']) {
        const group = document.createElement('optgroup');
        group.label = level;
        for (const type of types.filter(item => !item.legacy && item.level === level)) {
          const option = document.createElement('option');
          option.value = type.id;
          option.textContent = type.label;
          group.append(option);
        }
        if (group.children.length) typeInput.append(group);
      }

      async function api(path, options = {}) {
        const method = options.method || 'GET';
        const headers = { Accept: 'application/json', ...(options.headers || {}) };
        if (options.body !== undefined) headers['Content-Type'] = 'application/json';
        const response = await fetch(path, {
          method,
          headers,
          credentials: 'same-origin',
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.error || 'İstek tamamlanamadı.');
        }
        return result;
      }
      async function refreshMatches() {
        const result = await api('/api/matches');
        matches = result.matches;
        render();
      }
      function currentType() { return types.find(type => type.id === typeInput.value) || types[0]; }
      function roundMoney(value) { return Math.round((Number(value) + Number.EPSILON) * 100) / 100; }
      function numberValue(input) { const n = Number(input.value); return Number.isFinite(n) && n >= 0 ? roundMoney(n) : 0; }
      function money(value) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(roundMoney(value || 0));
      }
      function baseFee() { return currentType().fees[roleInput.value] || 0; }
      function allowanceDefault() {
        const type = currentType();
        if (!type.allowance || secondInput.checked) return 0;
        return roundMoney(baseFee() * (locationInput.value === 'away' ? 0.5 : 0.25));
      }
      function calculatedTravel() {
        if (secondInput.checked) return 0;
        return numberValue(travelInput);
      }
      function calculatedAllowance() {
        if (secondInput.checked || !currentType().allowance) return 0;
        return numberValue(allowanceInput);
      }
      function refreshPreview() {
        const fee = baseFee();
        const travel = calculatedTravel();
        const allowance = calculatedAllowance();
        $('previewMatch').textContent = money(fee);
        $('previewTravel').textContent = money(travel);
        $('previewAllowance').textContent = money(allowance);
        $('previewTotal').textContent = money(fee + travel + allowance);
      }
      function refreshControls(recomputeAllowance = false) {
        const special = !currentType().allowance;
        const locked = secondInput.checked;
        const disableExpenses = locked;
        locationInput.disabled = disableExpenses || special;
        distanceInput.disabled = disableExpenses;
        travelInput.disabled = disableExpenses;
        allowanceInput.disabled = disableExpenses || special;
        if (recomputeAllowance && !locked) allowanceInput.value = String(allowanceDefault());
        if (locked) {
          travelInput.value = '0';
          allowanceInput.value = '0';
        } else if (special) {
          allowanceInput.value = '0';
          $('allowanceHint').textContent = 'Bu maç türü için tabloda harcırah belirtilmemiş.';
        } else {
          $('allowanceHint').textContent = 'Maç ücretine göre hesaplanır; tutarı değiştirebilirsiniz.';
        }
        if (locked) $('allowanceHint').textContent = '2. maçta harcırah ve yol ücreti 0 TL olur.';
        refreshPreview();
      }
      function parseDateParts(date) {
        const [year, month, day] = date.split('-').map(Number);
        return { year, month, day };
      }
      function displayDate(date) {
        const { year, month, day } = parseDateParts(date);
        return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
      }
      function monthKey(date) {
        const { year, month } = parseDateParts(date);
        return `${year}-${String(month).padStart(2, '0')}`;
      }
      function makeCell(row, text, className = '') {
        const cell = document.createElement('td');
        if (className) cell.className = className;
        cell.textContent = text;
        row.append(cell);
        return cell;
      }
      function iconMarkup(name) { return `<svg class="ui-icon" aria-hidden="true"><use href="#tabler-${name}"></use></svg>`; }
      function monthlyChartPoints() {
        const totals = new Map();
        for (const match of matches) totals.set(monthKey(match.date), (totals.get(monthKey(match.date)) || 0) + match.total);
        return [...totals.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([key, total]) => {
          const [year, month] = key.split('-').map(Number);
          return { key, label: `${monthNames[month - 1].slice(0, 3)} ${year}`, total: roundMoney(total) };
        });
      }
      function updateEarningsChart() {
        const points = monthlyChartPoints();
        const fallback = $('chartFallback');
        const canvasWrap = $('chartCanvasWrap');
        const hasChartJs = typeof window.Chart === 'function';
        $('chartPeriod').textContent = points.length ? `Son ${points.length} kayıtlı ay` : 'Henüz veri yok';
        fallback.replaceChildren();
        if (!points.length) {
          const empty = document.createElement('div'); empty.className = 'chart-empty';
          empty.textContent = 'Aylık kazanç grafiğini görmek için maç ekleyin.';
          fallback.append(empty);
          fallback.hidden = false;
          canvasWrap.hidden = true;
          if (earningsChart) { earningsChart.destroy(); earningsChart = null; }
          return;
        }
        const max = Math.max(...points.map(point => point.total), 0);
        for (const point of points) {
          const row = document.createElement('div'); row.className = 'chart-row';
          const label = document.createElement('span'); label.className = 'chart-month'; label.textContent = point.label;
          const track = document.createElement('div'); track.className = 'chart-track';
          const fill = document.createElement('div'); fill.className = 'chart-fill';
          fill.style.width = `${max ? Math.max(2, point.total / max * 100) : 0}%`;
          track.append(fill);
          const amount = document.createElement('span'); amount.className = 'chart-amount'; amount.textContent = money(point.total);
          row.append(label, track, amount); fallback.append(row);
        }
        if (currentPage !== 'stats') {
          fallback.hidden = false;
          canvasWrap.hidden = true;
          return;
        }
        if (!hasChartJs) {
          fallback.hidden = false;
          canvasWrap.hidden = true;
          return;
        }
        fallback.hidden = true;
        canvasWrap.hidden = false;
        const dark = document.documentElement.dataset.theme === 'dark';
        const tickColor = dark ? '#a1b2bd' : '#70818d';
        const gridColor = dark ? 'rgba(205,225,235,.10)' : 'rgba(37,65,82,.09)';
        const barColor = dark ? 'rgba(82,183,136,.82)' : 'rgba(29,128,95,.78)';
        const compact = new Intl.NumberFormat('tr-TR', { notation: 'compact', maximumFractionDigits: 1 });
        const chartData = {
          labels: points.map(point => point.label),
          datasets: [{
            label: 'Toplam kazanç',
            data: points.map(point => point.total),
            backgroundColor: points.map((_, index) => index === points.length - 1 ? (dark ? '#69c99c' : '#1d805f') : barColor),
            borderRadius: 7,
            borderSkipped: false,
            barThickness: 19,
            maxBarThickness: 24
          }]
        };
        const chartOptions = {
          indexAxis: 'y', responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: context => ` ${money(context.raw)}` } }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: gridColor, drawBorder: false },
              ticks: { color: tickColor, font: { family: 'Segoe UI, Arial, sans-serif', size: 11 }, callback: value => compact.format(value) }
            },
            y: {
              grid: { display: false, drawBorder: false },
              ticks: { color: tickColor, font: { family: 'Segoe UI, Arial, sans-serif', size: 11 } }
            }
          }
        };
        if (!earningsChart) {
          earningsChart = new window.Chart($('earningsChart').getContext('2d'), { type: 'bar', data: chartData, options: chartOptions });
        } else {
          earningsChart.data = chartData;
          earningsChart.options = chartOptions;
          earningsChart.update('none');
        }
      }
      function updateCategoryChart() {
        const palette = ['#2d9a70', '#508db7', '#d4a943', '#a47ac4', '#df7c69', '#5b9d98'];
        const counts = new Map();
        for (const match of matches) counts.set(match.typeId, (counts.get(match.typeId) || 0) + 1);
        const entries = types.map(type => ({ type, count: counts.get(type.id) || 0 })).filter(item => item.count > 0).sort((a, b) => b.count - a.count);
        const total = matches.length;
        $('categoryTotalBadge').textContent = `${total} maç`;
        const rows = $('categoryRows'); rows.replaceChildren();
        const canvasWrap = $('categoryChartWrap');
        const fallback = $('categoryPieFallback');
        const empty = $('categoryEmpty');
        if (!total) {
          canvasWrap.hidden = true; fallback.hidden = true; empty.hidden = false;
          $('categoryFooter').replaceChildren();
          if (categoryChart) { categoryChart.destroy(); categoryChart = null; }
          return;
        }
        empty.hidden = true;
        const segments = [];
        let degree = 0;
        entries.forEach((entry, index) => {
          const color = palette[index % palette.length];
          const next = degree + entry.count / total * 360;
          segments.push(`${color} ${degree}deg ${next}deg`);
          degree = next;
          const row = document.createElement('tr');
          const categoryCell = document.createElement('td');
          const categoryName = document.createElement('div'); categoryName.className = 'category-name-cell';
          const dot = document.createElement('span'); dot.className = 'category-color-dot'; dot.style.backgroundColor = color;
          const label = document.createElement('span'); label.textContent = entry.type.label;
          categoryName.append(dot, label); categoryCell.append(categoryName); row.append(categoryCell);
          makeCell(row, String(entry.count), 'money');
          makeCell(row, `${Math.round(entry.count / total * 100)}%`, 'money');
          rows.append(row);
        });
        const totalRow = document.createElement('tr');
        const totalLabel = document.createElement('td'); totalLabel.textContent = 'Toplam'; totalRow.append(totalLabel);
        makeCell(totalRow, String(total), 'money'); makeCell(totalRow, '100%', 'money');
        const foot = $('categoryFooter'); foot.replaceChildren(totalRow);
        $('categoryPieCount').textContent = String(total);
        $('categoryChartCount').textContent = String(total);
        fallback.style.background = `conic-gradient(${segments.join(', ')})`;
        if (typeof window.Chart !== 'function' || currentPage !== 'stats') {
          canvasWrap.hidden = true; fallback.hidden = false;
          return;
        }
        fallback.hidden = true; canvasWrap.hidden = false;
        const dark = document.documentElement.dataset.theme === 'dark';
        const chartData = {
          labels: entries.map(entry => entry.type.label),
          datasets: [{
            data: entries.map(entry => entry.count),
            backgroundColor: entries.map((_, index) => palette[index % palette.length]),
            borderColor: dark ? '#17242e' : '#ffffff',
            borderWidth: 3,
            hoverOffset: 7
          }]
        };
        const chartOptions = {
          responsive: true, maintainAspectRatio: false, cutout: '67%',
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: context => ` ${context.label}: ${context.raw} maç · ${Math.round(context.raw / total * 100)}%` } }
          }
        };
        if (!categoryChart) categoryChart = new window.Chart($('categoryChart').getContext('2d'), { type: 'doughnut', data: chartData, options: chartOptions });
        else { categoryChart.data = chartData; categoryChart.options = chartOptions; categoryChart.update('none'); }
      }
      function getMonthGroups() {
        const groups = new Map();
        for (const match of matches) {
          const key = monthKey(match.date);
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key).push(match);
        }
        for (const list of groups.values()) list.sort((a, b) => a.date.localeCompare(b.date));
        return groups;
      }
      function monthNameFor(key) {
        const [year, month] = key.split('-').map(Number);
        return `${year} ${monthNames[month - 1]}`;
      }
      function renderMonthCards(groups) {
        const cards = $('monthCards');
        cards.replaceChildren();
        const sortedMonths = [...groups.keys()].sort((a, b) => b.localeCompare(a));
        if (!sortedMonths.length) {
          const empty = document.createElement('div'); empty.className = 'empty-state';
          const mark = document.createElement('div'); mark.className = 'empty-mark'; mark.innerHTML = iconMarkup('plus');
          const strong = document.createElement('strong'); strong.textContent = 'Henüz aylık tablo yok';
          const note = document.createElement('span'); note.textContent = 'Maç ekledikçe ay kartları burada görünecek.';
          empty.append(mark, strong, note); cards.append(empty); return;
        }
        for (const key of sortedMonths) {
          const list = groups.get(key);
          const sum = list.reduce((total, item) => total + item.total, 0);
          const card = document.createElement('button');
          card.type = 'button'; card.className = `month-card-button${key === selectedMonthKey ? ' selected' : ''}`; card.setAttribute('aria-label', `${monthNameFor(key)} tablosunu aç`);
          const top = document.createElement('span'); top.className = 'month-card-top';
          const icon = document.createElement('span'); icon.className = 'month-card-icon'; icon.innerHTML = iconMarkup('calendar-month');
          const arrow = document.createElement('span'); arrow.className = 'month-card-arrow'; arrow.innerHTML = iconMarkup('chevron-right');
          top.append(icon, arrow);
          const name = document.createElement('span'); name.className = 'month-card-name'; name.textContent = monthNameFor(key);
          const meta = document.createElement('span'); meta.className = 'month-card-meta'; meta.textContent = `${list.length} maç`;
          const total = document.createElement('span'); total.className = 'month-card-sum'; total.textContent = money(sum);
          card.append(top, name, meta, total);
          card.addEventListener('click', () => {
            selectedMonthKey = key;
            document.querySelectorAll('.month-card-button').forEach(item => item.classList.toggle('selected', item === card));
            renderMonthDetail(groups);
            $('monthModal').hidden = false;
            document.body.classList.add('modal-open');
            showPage('months');
            animateMonthModalIn();
            $('closeMonthModal').focus();
            $('closeMonthModal').focus();
          });
          cards.append(card);
        }
      }
      function renderMonthDetail(groups) {
        const modal = $('monthModal');
        const list = selectedMonthKey ? groups.get(selectedMonthKey) : null;
        if (!list || !list.length) {
          selectedMonthKey = null;
          modal.hidden = true;
          document.body.classList.remove('modal-open');
          return;
        }
        $('selectedMonthName').textContent = monthNameFor(selectedMonthKey);
        $('selectedMonthCount').textContent = `${list.length} maç · Aylık toplam ${money(list.reduce((sum, item) => sum + item.total, 0))}`;
        const rows = $('selectedMonthRows'); rows.replaceChildren();
        for (const match of list) {
          const row = document.createElement('tr');
          makeCell(row, displayDate(match.date), 'date-cell');
          makeCell(row, (types.find(type => type.id === match.typeId) || {}).label || '');
          const roleCell = document.createElement('td');
          const roleTag = document.createElement('span'); roleTag.className = 'role-tag'; roleTag.textContent = roles[match.role] || match.role;
          roleCell.append(roleTag);
          if (match.second) { const secondTag = document.createElement('span'); secondTag.className = 'second-tag'; secondTag.textContent = '2. maç'; roleCell.append(document.createElement('br'), secondTag); }
          row.append(roleCell);
          makeCell(row, money(match.matchFee), 'money');
          makeCell(row, money(match.travelFee), 'money');
          makeCell(row, money(match.allowance), 'money');
          makeCell(row, money(match.total), 'money total-cell');
          const actionCell = document.createElement('td');
          const actions = document.createElement('div'); actions.className = 'row-actions no-print';
          const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'edit-btn'; edit.innerHTML = `${iconMarkup('pencil')} Düzenle`;
          edit.addEventListener('click', () => beginEdit(match));
          const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'delete-btn'; remove.innerHTML = `${iconMarkup('trash')} Sil`;
          remove.addEventListener('click', () => deleteMatch(match));
          actions.append(edit, remove); actionCell.append(actions); row.append(actionCell);
          rows.append(row);
        }
        const totals = list.reduce((sum, item) => ({ fee: sum.fee + item.matchFee, travel: sum.travel + item.travelFee, allowance: sum.allowance + item.allowance, total: sum.total + item.total }), { fee: 0, travel: 0, allowance: 0, total: 0 });
        const foot = $('selectedMonthTotal'); foot.replaceChildren();
        const totalRow = document.createElement('tr');
        const label = document.createElement('td'); label.colSpan = 3; label.textContent = 'AYLIK TOPLAM'; totalRow.append(label);
        makeCell(totalRow, money(totals.fee), 'money');
        makeCell(totalRow, money(totals.travel), 'money');
        makeCell(totalRow, money(totals.allowance), 'money');
        makeCell(totalRow, money(totals.total), 'money total-cell');
        totalRow.append(document.createElement('td')); foot.append(totalRow);
      }
      function renderEarningsMonthList(groups) {
        const container = $('earningsMonthList'); container.replaceChildren();
        const sortedMonths = [...groups.keys()].sort((a, b) => b.localeCompare(a));
        if (!sortedMonths.length) {
          const empty = document.createElement('div'); empty.className = 'empty-state';
          const strong = document.createElement('strong'); strong.textContent = 'Henüz kazanç kaydı yok';
          const note = document.createElement('span'); note.textContent = 'Maç ekledikçe aylık kazançlar burada listelenir.';
          empty.append(strong, note); container.append(empty); return;
        }
        for (const key of sortedMonths) {
          const list = groups.get(key);
          const item = document.createElement('article'); item.className = 'earnings-month-item';
          const text = document.createElement('div');
          const name = document.createElement('span'); name.className = 'earnings-month-name'; name.textContent = monthNameFor(key);
          const count = document.createElement('span'); count.className = 'earnings-month-count'; count.textContent = `${list.length} maç`;
          text.append(name, count);
          const sum = document.createElement('span'); sum.className = 'earnings-month-sum'; sum.textContent = money(list.reduce((total, match) => total + match.total, 0));
          item.append(text, sum); container.append(item);
        }
      }
      function renderTopCategoryMatches(topType) {
        const rows = $('topTypeMatchesRows');
        rows.replaceChildren();
        if (!topType) {
          const row = document.createElement('tr');
          const cell = document.createElement('td');
          cell.colSpan = 3;
          cell.className = 'top-type-empty';
          cell.textContent = 'Henüz maç kaydı yok.';
          row.append(cell);
          rows.append(row);
          $('topTypeMatchesCaption').textContent = 'Maçlarınız burada listelenir.';
          $('topTypeMatchesBadge').textContent = '0 maç';
          return;
        }
        const categoryMatches = matches
          .filter(match => match.typeId === topType.id)
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date));
        $('topTypeMatchesCaption').textContent = `${topType.label} kategorisindeki maçlarınız`;
        $('topTypeMatchesBadge').textContent = `${categoryMatches.length} maç`;
        for (const match of categoryMatches) {
          const row = document.createElement('tr');
          const dateCell = document.createElement('td');
          dateCell.className = 'date-cell';
          dateCell.textContent = displayDate(match.date);
          const typeCell = document.createElement('td');
          typeCell.textContent = topType.label;
          const roleCell = document.createElement('td');
          roleCell.textContent = roles[match.role] || match.role;
          row.append(dateCell, typeCell, roleCell);
          rows.append(row);
        }
      }
      function render() {
        const groups = getMonthGroups();
        const grand = matches.reduce((sum, item) => sum + item.total, 0);
        $('grandTotal').textContent = money(grand);
        $('earningsPageTotal').textContent = money(grand);
        $('matchCount').textContent = `${matches.length} maç`;
        const now = new Date();
        const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const thisMonthCount = matches.filter(item => monthKey(item.date) === thisMonthKey).length;
        $('statMonthCount').textContent = `${thisMonthCount} maç`;
        $('statMonthLabel').textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
        $('statAverage').textContent = money(matches.length ? grand / matches.length : 0);
        let topType = null;
        if (matches.length) {
          const counts = new Map();
          for (const item of matches) counts.set(item.typeId, (counts.get(item.typeId) || 0) + 1);
          topType = types.reduce((best, type) => (counts.get(type.id) || 0) > (counts.get(best.id) || 0) ? type : best, types[0]);
          const topCount = counts.get(topType.id) || 0;
          $('statTopType').textContent = topType.label;
          $('statTopTypeShare').textContent = `${Math.round(topCount / matches.length * 100)}% · ${topCount} maç`;
        } else {
          $('statTopType').textContent = '—';
          $('statTopTypeShare').textContent = 'Henüz maç yok';
        }
        renderTopCategoryMatches(topType);
        renderMonthCards(groups);
        renderMonthDetail(groups);
        renderEarningsMonthList(groups);
        updateEarningsChart();
        updateCategoryChart();
      }
      function showToast(message) {
        const toast = $('toast'); toast.textContent = message; toast.classList.add('show');
        clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
      }
      async function deleteMatch(match) {
        const typeName = (types.find(type => type.id === match.typeId) || {}).label || 'maç';
        if (!window.confirm(`${displayDate(match.date)} tarihli ${typeName} maçını silmek istiyor musunuz?`)) return;
        try {
          await api(`/api/matches/${encodeURIComponent(match.id)}`, { method: 'DELETE' });
          matches = matches.filter(item => item.id !== match.id);
          if (editingId === match.id) resetForm();
          render(); showToast('Maç silindi.');
        } catch (error) { showToast(error.message); }
      }
      function showPage(page) {
        const pages = {
          home: ['Ana Sayfa', 'GENEL BAKIŞ', 'Hakem ücretlerinizi ve maçlarınızı takip edin.'],
          add: ['Maç Ekle', 'MAÇ KAYDI', 'Yeni maç bilgilerini ve ücretlerini girin.'],
          months: ['Aylık Tablo', 'MAÇ TABLOLARI', 'Aylara göre maçlarınızı görüntüleyin ve dışa aktarın.'],
          stats: ['İstatistikler', 'İSTATİSTİKLER', 'Kazançlarınızı ve yönettiğiniz maç kategorilerini inceleyin.'],
        };
        if (!pages[page]) page = 'home';
        currentPage = page;
        document.querySelectorAll('.page').forEach(section => section.classList.toggle('active', section.dataset.page === page));
        document.querySelectorAll('.side-nav-item, .nav-btn').forEach(button => {
          const active = button.dataset.openPage === page;
          button.classList.toggle('active', active);
          if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
        });
        $('pageTitle').textContent = pages[page][0];
        $('pageEyebrow').textContent = pages[page][1];
        $('pageSubtitle').textContent = pages[page][2];
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (page === 'stats') {
          updateEarningsChart();
          updateCategoryChart();
          requestAnimationFrame(() => {
            if (earningsChart) earningsChart.resize();
            if (categoryChart) categoryChart.resize();
          });
        }
      }
      function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); link.href = url; link.download = filename;
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      function exportSelectedMonthExcel() {
        if (!selectedMonthKey) return;
        const list = (getMonthGroups().get(selectedMonthKey) || []).slice().sort((a, b) => a.date.localeCompare(b.date));
        if (!list.length) return;
        const totals = list.reduce((sum, match) => ({ fee: sum.fee + match.matchFee, travel: sum.travel + match.travelFee, allowance: sum.allowance + match.allowance, total: sum.total + match.total }), { fee: 0, travel: 0, allowance: 0, total: 0 });
        const headers = ['Tarih', 'Maç türü', 'Görev', 'Maç ücreti (TL)', 'Yol ücreti (TL)', 'Harcırah (TL)', 'Toplam (TL)', '2. maç'];
        const dataRows = list.map(match => [
          displayDate(match.date),
          (types.find(type => type.id === match.typeId) || {}).label || '',
          roles[match.role] || match.role,
          match.matchFee,
          match.travelFee,
          match.allowance,
          match.total,
          match.second ? 'Evet' : 'Hayır'
        ]);
        const tableRows = [[monthNameFor(selectedMonthKey)], headers, ...dataRows, [], ['Aylık toplam', '', '', totals.fee, totals.travel, totals.allowance, totals.total, '']];
        const filename = `Hakem-Aylik-Tablo-${selectedMonthKey}`;
        if (window.XLSX && window.XLSX.utils) {
          const worksheet = window.XLSX.utils.aoa_to_sheet(tableRows);
          worksheet['!cols'] = [{ wch: 15 }, { wch: 42 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 12 }];
          const workbook = window.XLSX.utils.book_new();
          window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Maçlar');
          window.XLSX.writeFile(workbook, `${filename}.xlsx`);
          showToast('Excel dosyası indirildi.');
          return;
        }
        const csv = '\uFEFF' + tableRows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(';')).join('\r\n');
        downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `${filename}.csv`);
        showToast('Excel modülü yüklenemedi; Excel uyumlu CSV indirildi.');
      }
      function exportSelectedMonthPdf() {
        if (!selectedMonthKey) return;
        showToast('Yazdırma penceresinde “PDF olarak kaydet” seçin.');
        window.print();
      }
      function closeMonthModal() {
        stopModalAnimation();
        $('monthModal').hidden = true;
        document.body.classList.remove('modal-open');
      }
      let profileReturnFocus = null;
      function openProfileDrawer(trigger) {
        profileReturnFocus = trigger || document.activeElement;
        $('profileDrawer').hidden = false;
        document.body.classList.add('profile-open');
        $('closeProfileDrawer').focus();
      }
      function closeProfileDrawer() {
        if ($('profileDrawer').hidden) return;
        $('profileDrawer').hidden = true;
        document.body.classList.remove('profile-open');
        if (profileReturnFocus && typeof profileReturnFocus.focus === 'function') profileReturnFocus.focus();
        profileReturnFocus = null;
      }
      function stopModalAnimation() {
        if (modalAnimation && typeof modalAnimation.stop === 'function') modalAnimation.stop();
        else if (modalAnimation && typeof modalAnimation.cancel === 'function') modalAnimation.cancel();
        modalAnimation = null;
      }
      function animateMonthModalIn() {
        const panel = $('monthDetail');
        if ($('monthModal').hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        stopModalAnimation();
        if (window.Motion && typeof window.Motion.animate === 'function') {
          modalAnimation = window.Motion.animate(panel, { y: [52, 0], opacity: [0, 1], scale: [.985, 1] }, { type: 'spring', stiffness: 430, damping: 34, bounce: .12 });
        } else if (typeof panel.animate === 'function') {
          modalAnimation = panel.animate([
            { transform: 'translateY(52px) scale(.985)', opacity: 0 },
            { transform: 'translateY(0) scale(1)', opacity: 1 }
          ], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' });
        }
      }
      function setTheme(theme, persist = true) {
        const dark = theme === 'dark';
        document.documentElement.dataset.theme = dark ? 'dark' : 'light';
        $('themeToggle').classList.toggle('is-dark', dark);
        $('themeToggle').setAttribute('aria-checked', String(dark));
        $('themeLabel').textContent = dark ? 'Koyu tema açık' : 'Açık tema açık';
        $('themeToggle').setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
        if (persist) {
          const value = dark ? 'dark' : 'light';
          try { localStorage.setItem(THEME_KEY, value); } catch { /* Tema bu oturumda uygulanır. */ }
          if (window.localPreferences && typeof window.localPreferences.setTheme === 'function') {
            window.localPreferences.setTheme(value).catch(() => {});
          }
        }
        if (typeof updateEarningsChart === 'function') updateEarningsChart();
        if (typeof updateCategoryChart === 'function') updateCategoryChart();
      }
      function resetForm() {
        editingId = null;
        form.reset();
        const today = new Date();
        dateInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        typeInput.value = types[0].id;
        roleInput.value = 'referee';
        locationInput.value = 'home';
        distanceInput.value = '0';
        travelInput.value = '0';
        allowanceInput.value = String(allowanceDefault());
        $('formTitle').textContent = 'Maç ekle';
        $('saveButton').innerHTML = `${iconMarkup('plus')} Maçı ekle`;
        $('cancelEdit').hidden = true;
        refreshControls(false);
      }
      function beginEdit(match) {
        editingId = match.id;
        dateInput.value = match.date;
        typeInput.value = match.typeId;
        roleInput.value = match.role;
        secondInput.checked = Boolean(match.second);
        locationInput.value = match.locationType || 'home';
        distanceInput.value = match.second ? '0' : (match.distanceBand || '0');
        travelInput.value = String(match.travelFee || 0);
        allowanceInput.value = String(match.allowance || 0);
        $('formTitle').textContent = 'Maçı düzenle';
        $('saveButton').textContent = 'Değişiklikleri kaydet';
        $('cancelEdit').hidden = false;
        refreshControls(false);
        closeMonthModal();
        showPage('add');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      function setMessage(id, message, isError = false) {
        const node = $(id);
        if (!node) return;
        node.textContent = message;
        node.classList.toggle('error', Boolean(isError));
      }

      typeInput.addEventListener('change', () => refreshControls(true));
      roleInput.addEventListener('change', () => refreshControls(true));
      locationInput.addEventListener('change', () => refreshControls(true));
      distanceInput.addEventListener('change', () => {
        travelInput.value = String(travelRates[distanceInput.value] || 0);
        refreshPreview();
      });
      secondInput.addEventListener('change', () => {
        if (secondInput.checked) distanceInput.value = '0';
        refreshControls(false);
      });
      travelInput.addEventListener('input', refreshPreview);
      allowanceInput.addEventListener('input', refreshPreview);
      $('cancelEdit').addEventListener('click', resetForm);
      $('themeToggle').addEventListener('click', () => {
        setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
      });
      $('profileTopButton').addEventListener('click', event => openProfileDrawer(event.currentTarget));
      $('profileSidebarButton').addEventListener('click', event => openProfileDrawer(event.currentTarget));
      $('closeProfileDrawer').addEventListener('click', closeProfileDrawer);
      $('profileDrawer').addEventListener('click', event => {
        if (event.target === $('profileDrawer')) closeProfileDrawer();
      });
      document.querySelectorAll('[data-open-page]').forEach(link => {
        link.addEventListener('click', event => {
          if (link.tagName === 'A') event.preventDefault();
          showPage(link.dataset.openPage);
        });
      });
      $('closeMonthModal').addEventListener('click', closeMonthModal);
      $('monthModal').addEventListener('click', event => {
        if (event.target === $('monthModal')) closeMonthModal();
      });
      document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        if (!$('profileDrawer').hidden) closeProfileDrawer();
        else if (!$('monthModal').hidden) closeMonthModal();
      });
      $('exportPdf').addEventListener('click', exportSelectedMonthPdf);
      $('exportExcel').addEventListener('click', exportSelectedMonthExcel);
      window.refreshCharts = () => { updateEarningsChart(); updateCategoryChart(); };
      window.runMonthModalAnimation = animateMonthModalIn;
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!dateInput.value) { dateInput.focus(); return; }
        const fee = baseFee();
        const travel = calculatedTravel();
        const allowance = calculatedAllowance();
        const record = {
          id: editingId || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
          date: dateInput.value,
          typeId: typeInput.value,
          role: roleInput.value,
          second: secondInput.checked,
          locationType: locationInput.value,
          distanceBand: distanceInput.value,
          matchFee: fee,
          travelFee: travel,
          allowance,
          total: roundMoney(fee + travel + allowance)
        };
        try {
          if (editingId) {
            await api(`/api/matches/${encodeURIComponent(editingId)}`, { method: 'PUT', body: record });
            showToast('Maç bilgileri güncellendi.');
          } else {
            await api('/api/matches', { method: 'POST', body: record });
            showToast('Maç eklendi.');
          }
          await refreshMatches();
          resetForm();
        } catch (error) { showToast(error.message); }
      });

      $('resetForm').addEventListener('submit', async event => {
        event.preventDefault();
        setMessage('resetMessage', '');
        if ($('resetConfirm').value.trim() !== 'SIFIRLA') {
          setMessage('resetMessage', 'Onay alanına SIFIRLA yazın.', true);
          return;
        }
        if (!window.confirm('Bu bilgisayardaki tüm maç kayıtları kalıcı olarak silinecek. Devam edilsin mi?')) return;
        try {
          const result = await api('/api/season/reset', { method: 'POST', body: { confirmation: 'SIFIRLA' } });
          $('resetForm').reset();
          matches = [];
          render();
          setMessage('resetMessage', result.deleted + ' maç kaydı silindi.');
        } catch (error) { setMessage('resetMessage', error.message, true); }
      });

      try { setTheme(document.documentElement.dataset.theme || localStorage.getItem(THEME_KEY) || 'light', false); }
      catch { setTheme(document.documentElement.dataset.theme || 'light', false); }
      resetForm();
      async function loadInitialData() {
        const retryButton = $('retryInitialLoad');
        const loader = $('appLoader');
        retryButton.disabled = true;
        retryButton.hidden = true;
        loader.classList.remove('is-error');
        $('loaderTitle').textContent = 'Verileriniz yükleniyor';
        $('loaderMessage').textContent = 'Maç kayıtları hazırlanıyor.';
        loader.setAttribute('aria-busy', 'true');
        try {
          await refreshMatches();
          showPage('home');
          $('appShell').hidden = false;
          loader.hidden = true;
        } catch (error) {
          loader.classList.add('is-error');
          loader.setAttribute('aria-busy', 'false');
          $('loaderTitle').textContent = 'Veriler yüklenemedi';
          $('loaderMessage').textContent = error.message || 'Yerel veritabanına ulaşılamadı.';
          retryButton.disabled = false;
          retryButton.hidden = false;
        }
      }
      $('retryInitialLoad').addEventListener('click', loadInitialData);
      loadInitialData();
    })();
