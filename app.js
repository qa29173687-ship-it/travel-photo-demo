import {
  TRIP, PLACES, DAYS, PHOTOS, DAY_COLORS,
  formatDate, formatDateShort, dateOf, timeHm, yen, totalSpend,
  photoById, dayOfPhoto,
} from './data.js';

const KEY = 'travel-photo-demo-v1';
const SHARE_URL = 'https://qa29173687-ship-it.github.io/travel-photo-demo/#/join/TOKYO2026';

const $app = document.getElementById('app');
const $dlg = document.getElementById('dlg');
const $toast = document.getElementById('toast');

let state = load();
let mapInst = null;
let bookMapInst = null;
let toastTimer = 0;

function load() {
  const base = { imported: false, notes: {}, assigns: {} };
  try {
    return { ...base, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return base;
  }
}
function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function noteOf(day) {
  const d = typeof day === 'number' ? DAYS.find((x) => x.day === day) : day;
  if (!d) return '';
  return state.notes[d.day] ?? d.note;
}

function resolvedPlace(photo) {
  const a = state.assigns[photo.id];
  if (a) {
    if (typeof a === 'string' && PLACES[a]) return { ...PLACES[a], manual: true };
    if (a && a.custom) {
      return { id: 'custom-' + photo.id, name: a.custom, city: '', lat: null, lng: null, emoji: '📍', manual: true, custom: true };
    }
  }
  if (photo.placeId && PLACES[photo.placeId]) return PLACES[photo.placeId];
  return null;
}

function geoOf(photo) {
  if (photo.lat != null && photo.lng != null) return { lat: photo.lat, lng: photo.lng, manual: false };
  const p = resolvedPlace(photo);
  if (p && p.lat != null && p.lng != null) return { lat: p.lat, lng: p.lng, manual: true };
  return null;
}

function groupedDays() {
  const days = DAYS.map((d) => ({
    ...d,
    note: noteOf(d),
    places: [],
    unlocated: [],
  }));
  const byDate = Object.fromEntries(days.map((d) => [d.date, d]));
  for (const ph of PHOTOS) {
    const d = byDate[dateOf(ph.time)];
    if (!d) continue;
    const place = resolvedPlace(ph);
    const geo = geoOf(ph);
    if (!place && !geo) {
      d.unlocated.push(ph);
      continue;
    }
    const key = place ? place.id : 'geo-' + ph.id;
    let g = d.places.find((x) => x.place.id === key);
    if (!g) {
      g = {
        place: place || { id: key, name: '已定位', city: '', lat: ph.lat, lng: ph.lng, emoji: '📍' },
        photos: [],
      };
      d.places.push(g);
    }
    g.photos.push(ph);
  }
  return days;
}

function unlocatedAll() {
  return groupedDays().flatMap((d) => d.unlocated.map((p) => ({ photo: p, day: d })));
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function toast(msg) {
  $toast.textContent = msg;
  $toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $toast.classList.add('hidden'), 2200);
}

function closeDlg() {
  $dlg.classList.add('hidden');
  $dlg.innerHTML = '';
}

function openSheet(html) {
  $dlg.innerHTML = `<div class="sheet">${html}</div>`;
  $dlg.classList.remove('hidden');
}

function banner() {
  return `<div class="demo-banner">DEMO · 範例資料，不是正式 App</div>`;
}

function topbar(title, sub, opts = {}) {
  const back = opts.back
    ? `<button class="back" type="button" data-go="${esc(opts.back)}" aria-label="返回">‹</button>`
    : '';
  const extra = opts.extra || '';
  return `<div class="top">${back}<div class="t"><h1>${esc(title)}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}</div>${extra}</div>`;
}

function nav(active) {
  const items = [
    ['#/home', '🏠', '行程', 'home'],
    ['#/timeline', '🗓️', '時間軸', 'timeline'],
    ['#/map', '🗺️', '地圖', 'map'],
    ['#/book', '📖', '旅遊書', 'book'],
    ['#/about', 'ℹ️', '說明', 'about'],
  ];
  return `<nav class="nav">${items.map(([href, ico, lab, key]) =>
    `<a href="${href}" class="${key === active ? 'on' : ''}"><span class="ico">${ico}</span>${lab}</a>`
  ).join('')}</nav>`;
}

function route() {
  const raw = decodeURIComponent((location.hash || '#/').replace(/^#/, '') || '/');
  const parts = raw.split('/').filter(Boolean);
  return { parts, path: '/' + parts.join('/') };
}

function go(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

/* ---------- views ---------- */

function renderWelcome() {
  return `
    ${banner()}
    <div class="hero-cover">
      <img class="bg" src="${TRIP.cover}" alt="範例封面：金閣寺">
      <div class="veil"></div>
      <div class="inner">
        <div class="kicker">旅行照片整理器</div>
        <h1 class="serif">${esc(TRIP.title)}</h1>
        <div class="meta">${formatDate(TRIP.start)} — ${formatDateShort(TRIP.end)} · 5 天 · 27 張範例照片</div>
      </div>
    </div>
    <div class="body">
      <div class="card">
        <div class="lbl">示範怎麼整理旅行照片</div>
        <p class="muted" style="margin:8px 0 14px;line-height:1.6">按下匯入後，會模擬讀取每張照片的時間與 GPS，再依日期、地點自動分組。地圖用免費的 OpenStreetMap。正式 App 會在手機裡直接讀相簿，不必上傳。</p>
        <button class="btn ver" data-action="import">匯入 27 張範例照片</button>
        <button class="btn ghost" style="margin-top:8px" data-action="skip">先看整理好的範例</button>
      </div>
      <p class="hint">所有照片、花費、心得都是範例，只存在這個瀏覽器。</p>
    </div>`;
}

function renderImport() {
  return `
    <div class="import" id="import-view">
      <div class="kicker" style="letter-spacing:.14em;font-size:12px;opacity:.8">模擬讀取</div>
      <h1>正在讀取照片的時間與位置…</h1>
      <p class="hint" style="color:rgba(255,255,255,.75)">正式版會在手機上讀取 EXIF，這是示範動畫。</p>
      <div class="imp-bar"><i id="imp-bar"></i></div>
      <div class="imp-list" id="imp-list"></div>
      <div id="imp-sum" class="hint" style="color:rgba(255,255,255,.8);min-height:3em"></div>
    </div>`;
}

async function runImport() {
  const list = document.getElementById('imp-list');
  const bar = document.getElementById('imp-bar');
  const sum = document.getElementById('imp-sum');
  const title = document.querySelector('#import-view h1');
  if (!list) return;
  const items = PHOTOS;
  for (let i = 0; i < items.length; i++) {
    const p = items[i];
    const located = p.lat != null;
    const row = document.createElement('div');
    row.className = 'imp-row';
    row.innerHTML = `<img src="${p.file}" alt=""><div class="grow">${esc(p.filename)}<div style="font-weight:600;opacity:.75;font-size:11px">${timeHm(p.time)} ${located ? '· ' + fmtGps(p) : '· 沒有位置資訊'}</div></div><div class="ok">${located ? '已定位' : '未定位'}</div>`;
    list.prepend(row);
    while (list.children.length > 6) list.removeChild(list.lastChild);
    if (bar) bar.style.width = `${Math.round(((i + 1) / items.length) * 100)}%`;
    await wait(i < 6 ? 90 : 45);
  }
  const locatedN = PHOTOS.filter((p) => p.lat != null).length;
  const miss = PHOTOS.length - locatedN;
  if (title) title.textContent = '依日期與地點自動分組';
  if (sum) sum.innerHTML = `已定位 ${locatedN} 張 · 未定位 ${miss} 張<br>分成 5 天、14 個地點。`;
  await wait(900);
  state.imported = true;
  save();
  go('#/timeline');
}

function fmtGps(p) {
  if (p.lat == null) return '—';
  return `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`;
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function renderHome() {
  const days = groupedDays();
  const photos = PHOTOS.length;
  const miss = unlocatedAll().length;
  const spend = totalSpend();
  return `
    ${banner()}
    ${topbar('旅行照片整理器', '範例行程')}
    <div class="body with-nav">
      <div class="trip-card" data-go="#/timeline">
        <img class="bg" src="${TRIP.cover}" alt="範例封面：金閣寺">
        <div class="veil"></div>
        <div class="inner">
          <div class="row"><span class="badge demo">範例行程</span></div>
          <h2 class="serif">${esc(TRIP.title)}</h2>
          <div class="small">${formatDate(TRIP.start)} — ${formatDateShort(TRIP.end)}</div>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><div class="n">5 天</div><div class="l">東京＋京都</div></div>
        <div class="stat"><div class="n">${photos} 張</div><div class="l">${miss ? `未定位 ${miss}` : '皆已分組'}</div></div>
        <div class="stat"><div class="n">${yen(spend)}</div><div class="l">旅伴帳（範例）</div></div>
      </div>
      <div class="btns">
        <button class="btn" data-action="import">重新匯入</button>
        <button class="btn ghost" data-action="share">分享旅伴</button>
      </div>
      <div class="lbl">每天心得與花費</div>
      ${days.map((d) => `
        <a class="card tap" href="#/day/${d.day}" style="display:block;text-decoration:none;color:inherit">
          <div class="day-hd">
            <div>
              <div class="dno">DAY ${d.day}</div>
              <h3>${esc(d.title)}</h3>
              <div class="dt">${formatDateShort(d.date)} · ${d.places.reduce((n, g) => n + g.photos.length, 0) + d.unlocated.length} 張</div>
            </div>
            <div class="spend"><div class="yen">${yen(d.spend)}</div><div class="small">範例 · 旅伴帳</div></div>
          </div>
          <div class="note-box" style="margin-top:8px">${esc(d.note)}</div>
        </a>
      `).join('')}
    </div>
    ${nav('home')}`;
}

function renderTimeline() {
  const days = groupedDays();
  const miss = unlocatedAll();
  return `
    ${banner()}
    ${topbar('時間軸', '依日期與地點自動分組')}
    <div class="body with-nav">
      ${miss.length ? `<div class="unloc">
        <h4>📍 未定位 ${miss.length} 張</h4>
        <p class="hint" style="margin:0 0 8px">這幾張沒有 GPS，可指定地點後就會歸到該組，也能出現在地圖上。</p>
        <div class="thumbs">${miss.map(({ photo }) => thumb(photo, true)).join('')}</div>
      </div>` : ''}
      ${days.map((d) => dayCard(d, false)).join('')}
    </div>
    ${nav('timeline')}`;
}

function dayCard(d, detailed) {
  const count = d.places.reduce((n, g) => n + g.photos.length, 0) + d.unlocated.length;
  return `
    <section class="day-sec" id="day-${d.day}">
      <div class="day-hd">
        <div>
          <div class="dno">DAY ${d.day}</div>
          <h3>${esc(d.title)}</h3>
          <div class="dt">${formatDate(d.date)} · ${count} 張</div>
        </div>
        <div class="spend">
          <div class="yen">${yen(d.spend)}</div>
          <div class="small">範例 · ${esc(d.spendNote)}</div>
          <div class="small">串接旅伴帳</div>
        </div>
      </div>
      ${detailed ? `
        <div class="field" style="margin:8px 0 4px">
          <label class="lbl" for="note-${d.day}">今天的心得</label>
          <textarea id="note-${d.day}" data-note="${d.day}" placeholder="寫下今天想記住的事…">${esc(d.note)}</textarea>
        </div>
      ` : `<div class="hint" style="margin-bottom:8px">${esc(d.note)}</div>
        <a class="link" href="#/day/${d.day}">寫心得、看這一天 →</a>`}
      ${d.places.map((g) => `
        <div class="place-hd"><span class="em">${g.place.emoji || '📍'}</span> ${esc(g.place.name)}${g.place.city ? `<span class="muted small"> · ${esc(g.place.city)}</span>` : ''}${g.place.manual ? ' <span class="badge demo">手動</span>' : ''}</div>
        <div class="thumbs">${g.photos.map((p) => thumb(p)).join('')}</div>
      `).join('')}
      ${d.unlocated.length ? `
        <div class="unloc">
          <h4>未定位 ${d.unlocated.length} 張</h4>
          <div class="thumbs">${d.unlocated.map((p) => thumb(p, true)).join('')}</div>
        </div>` : ''}
    </section>`;
}

function thumb(photo, showAssign) {
  return `<a href="#/photo/${photo.id}">
    <img src="${photo.file}" alt="${esc(photo.caption)}（範例）">
    <span class="thumb-time">${timeHm(photo.time)}${showAssign ? ' · 未定位' : ''}</span>
  </a>`;
}

function renderDay(n) {
  const days = groupedDays();
  const d = days.find((x) => x.day === n);
  if (!d) return renderTimeline();
  return `
    ${banner()}
    ${topbar('Day ' + d.day, formatDate(d.date), { back: '#/timeline' })}
    <div class="body with-nav">
      ${dayCard(d, true)}
      <div class="btns">
        <a class="btn ghost" href="#/map/${d.day}">在地圖看這一天</a>
        <a class="btn ghost" href="#/book">打開旅遊書</a>
      </div>
    </div>
    ${nav('timeline')}`;
}

function renderMap(dayFilter) {
  const sub = dayFilter ? `Day ${dayFilter} 的路線` : '全部天數 · 點圖針看照片';
  return `
    ${banner()}
    ${topbar('地圖', sub, { back: '#/home' })}
    <div class="body map-body with-nav">
      <div class="map-filters-bar pills" id="map-filters">
        <button class="pill ${!dayFilter ? 'on' : ''}" data-mapday="">全部</button>
        ${DAYS.map((d) => `<button class="pill ${dayFilter === d.day ? 'on' : ''}" data-mapday="${d.day}" style="${dayFilter === d.day ? '' : `border-color:${DAY_COLORS[d.day]}`}">${d.day}日</button>`).join('')}
      </div>
      <div class="map-wrap" id="map-host">
        <div id="map"></div>
        <div class="map-legend">© OpenStreetMap（免費）<br>線條是當天移動路線（範例）</div>
      </div>
    </div>
    ${nav('map')}`;
}

function mountMap(dayFilter) {
  destroyMaps();
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  const photos = PHOTOS
    .map((p) => ({ p, geo: geoOf(p), day: dayOfPhoto(p) }))
    .filter((x) => x.geo && x.day && (!dayFilter || x.day.day === dayFilter));
  const map = L.map(el, { zoomControl: true, attributionControl: true, zoomSnap: 0.25, zoomDelta: 0.5 });
  map.zoomControl.setPosition('topright');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  const bounds = [];
  const days = [...new Set(photos.map((x) => x.day.day))].sort((a, b) => a - b);
  for (const dn of days) {
    const pts = photos
      .filter((x) => x.day.day === dn)
      .sort((a, b) => a.p.time.localeCompare(b.p.time));
    const latlngs = pts.map((x) => [x.geo.lat, x.geo.lng]);
    latlngs.forEach((ll) => bounds.push(ll));
    if (latlngs.length >= 2) {
      L.polyline(latlngs, { color: DAY_COLORS[dn], weight: 4, opacity: 0.85 }).addTo(map);
    }
    for (const x of pts) {
      const icon = L.divIcon({
        className: '',
        html: `<div class="pin-thumb ${x.geo.manual ? 'manual' : ''}"><img src="${x.p.file}" alt=""></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      const m = L.marker([x.geo.lat, x.geo.lng], { icon }).addTo(map);
      m.on('click', () => openPhotoSheet(x.p, x.day, x.geo));
    }
  }
  const fit = () => {
    map.invalidateSize();
    const w = el.clientWidth, h = el.clientHeight;
    if (w < 80 || h < 80) return false;
    if (bounds.length) {
      map.fitBounds(bounds, { padding: [12, 20], maxZoom: dayFilter ? 14 : 8 });
    } else {
      map.setView([35.2, 137.8], 7);
    }
    return true;
  };
  const retry = () => {
    let n = 0;
    const t = setInterval(() => {
      if (fit() || ++n > 20) clearInterval(t);
    }, 100);
  };
  map.whenReady(retry);
  setTimeout(retry, 50);
  mapInst = map;
}

function openPhotoSheet(photo, day, geo) {
  const place = resolvedPlace(photo);
  openSheet(`
    <h2>${esc(photo.caption)} <span class="badge demo">範例</span></h2>
    <img src="${photo.file}" alt="" style="width:100%;border-radius:14px;max-height:280px;object-fit:cover">
    <div class="muted small">${day ? `Day ${day.day} · ${formatDateShort(day.date)} ` : ''}${timeHm(photo.time)}</div>
    <div class="muted small">${place ? esc(place.name) + ' · ' : ''}${geo.manual ? '依指定地點標記' : fmtGps(photo)}</div>
    <div class="btns">
      <a class="btn" href="#/photo/${photo.id}" data-close>查看大圖</a>
      <button class="btn ghost" data-close>關閉</button>
    </div>`);
}

function renderPhoto(id) {
  const p = photoById(id);
  if (!p) return renderTimeline();
  const day = dayOfPhoto(p);
  const place = resolvedPlace(p);
  const geo = geoOf(p);
  const idx = PHOTOS.findIndex((x) => x.id === id);
  const prev = PHOTOS[idx - 1];
  const next = PHOTOS[idx + 1];
  const missing = !geo;
  return `
    <div class="viewer">
      <div class="vh">
        <button class="back" type="button" data-go="${day ? '#/day/' + day.day : '#/timeline'}" aria-label="返回">‹</button>
        <div class="t grow"><h1 style="font-size:16px">${esc(p.caption)}</h1>
          <div class="sub" style="color:rgba(255,255,255,.75)">${day ? `Day ${day.day} · ` : ''}${timeHm(p.time)} · 範例</div></div>
      </div>
      <div class="stage">
        ${prev ? `<button class="navbtn prev" data-go="#/photo/${prev.id}" aria-label="上一張">‹</button>` : ''}
        <img src="${p.file}" alt="${esc(p.caption)}（範例）">
        ${next ? `<button class="navbtn next" data-go="#/photo/${next.id}" aria-label="下一張">›</button>` : ''}
      </div>
      <div class="meta">
        <div>${place ? `${place.emoji || ''} ${esc(place.name)}` : '未定位'}${place && place.city ? ` · ${esc(place.city)}` : ''}</div>
        <div class="small" style="opacity:.85;margin-top:4px">${p.filename} · ${day ? formatDate(day.date) + ' ' : ''}${timeHm(p.time)}${geo ? ` · ${geo.manual ? '手動標記 ' : ''}${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}` : ' · 沒有 GPS'}</div>
        ${missing ? `<button class="btn gold" style="margin-top:12px" data-action="assign" data-id="${p.id}">指定地點</button>` : ''}
        ${!missing && !p.lat ? `<button class="link" style="color:#fff" data-action="assign" data-id="${p.id}">改指定地點</button>` : ''}
      </div>
    </div>`;
}

function openAssign(id) {
  const p = photoById(id);
  if (!p) return;
  const places = Object.values(PLACES);
  openSheet(`
    <h2>指定地點</h2>
    <p class="hint">${esc(p.caption)}（${esc(p.filename)}）沒有 GPS。選一個這趟去過的地方，或自己輸入名稱。</p>
    <div class="pills wrap" style="flex-wrap:wrap">
      ${places.map((pl) => `<button class="pill" data-action="assign-to" data-id="${p.id}" data-place="${pl.id}">${pl.emoji} ${esc(pl.name)}</button>`).join('')}
    </div>
    <div class="field">
      <label class="lbl" for="custom-place">或自己寫地點</label>
      <input id="custom-place" type="text" placeholder="例如：新幹線車廂">
    </div>
    <button class="btn" data-action="assign-custom" data-id="${p.id}">用自己寫的名稱</button>
    <button class="btn ghost" data-close>取消</button>
  `);
}

function renderBook() {
  const days = groupedDays();
  return `
    ${banner()}
    ${topbar('相簿旅遊書', '可捲動的範例旅遊書', { extra: `<button class="icon-btn" data-action="share">分享</button>` })}
    <div class="book body flush with-nav">
      <section class="book-cover">
        <img class="bg" src="${TRIP.cover}" alt="範例封面：金閣寺">
        <div class="veil"></div>
        <div class="inner">
          <div class="kicker">PHOTO TRAVEL BOOK · 範例</div>
          <h1 class="serif">${esc(TRIP.title)}</h1>
          <div>${formatDate(TRIP.start)} — ${formatDateShort(TRIP.end)}</div>
          <div class="small" style="margin-top:8px;opacity:.9">27 張照片 · 與 ${esc(TRIP.companions.join('、'))} 同行</div>
        </div>
      </section>
      <section class="book-page">
        <div class="pno">OVERVIEW</div>
        <h2 class="serif">這五天的路線</h2>
        <p class="note">從東京淺草、澀谷，坐新幹線到京都的伏見稻荷、嵐山與金閣寺。地圖為 OpenStreetMap，花費數字串接自旅伴帳（皆為範例）。</p>
        <div class="mini-map" id="book-map"></div>
        <div class="row" style="justify-content:space-around;margin-top:8px">
          <div class="stat" style="flex:1"><div class="n">5</div><div class="l">天</div></div>
          <div class="stat" style="flex:1"><div class="n">27</div><div class="l">張照片</div></div>
          <div class="stat" style="flex:1"><div class="n">${yen(totalSpend())}</div><div class="l">範例花費</div></div>
        </div>
      </section>
      ${days.map((d) => bookPage(d)).join('')}
      <section class="book-page book-end">
        <div class="pno">END</div>
        <h2 class="serif">下一趟見</h2>
        <p class="note">這是示範用的旅遊書。正式版會用你手機裡的照片自動排版。</p>
        <button class="btn" data-action="share">分享給旅伴</button>
      </section>
    </div>
    ${nav('book')}`;
}

function bookPage(d) {
  const photos = [...d.places.flatMap((g) => g.photos), ...d.unlocated];
  const stops = d.places.map((g) => `${g.place.emoji || ''} ${g.place.name}`).join(' → ');
  return `
    <section class="book-page" id="book-day-${d.day}">
      <div class="pno">DAY ${d.day} · ${formatDateShort(d.date)}</div>
      <h2 class="serif">${esc(d.title)}</h2>
      <div class="route">${d.places.map((g) => `<span class="badge ind">${esc(g.place.emoji)} ${esc(g.place.name)}</span>`).join('')}${d.unlocated.length ? `<span class="badge mute">未定位 ${d.unlocated.length}</span>` : ''}</div>
      <div class="spend" style="text-align:left;margin-bottom:8px">${yen(d.spend)} <span class="badge demo">範例 · 旅伴帳</span> <span class="small muted">${esc(d.spendNote)}</span></div>
      <p class="note">${esc(d.note)}</p>
      <div class="book-mosaic">
        ${photos.map((p, i) => `<a class="${i === 0 ? 'big' : ''}" href="#/photo/${p.id}"><img src="${p.file}" alt="${esc(p.caption)}（範例）"></a>`).join('')}
      </div>
      ${stops ? `<p class="hint">路線：${esc(stops)}</p>` : ''}
    </section>`;
}

function mountBookMap() {
  const el = document.getElementById('book-map');
  if (!el || typeof L === 'undefined') return;
  const map = L.map(el, { zoomControl: false, dragging: false, scrollWheelZoom: false, attributionControl: true });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap',
  }).addTo(map);
  const bounds = [];
  for (const d of DAYS) {
    const pts = PHOTOS
      .filter((p) => dateOf(p.time) === d.date)
      .map((p) => ({ p, geo: geoOf(p) }))
      .filter((x) => x.geo)
      .sort((a, b) => a.p.time.localeCompare(b.p.time))
      .map((x) => [x.geo.lat, x.geo.lng]);
    pts.forEach((ll) => bounds.push(ll));
    if (pts.length >= 2) {
      L.polyline(pts, { color: DAY_COLORS[d.day], weight: 3, opacity: 0.9 }).addTo(map);
    }
    if (pts[0]) L.circleMarker(pts[0], { radius: 5, color: DAY_COLORS[d.day], fillColor: DAY_COLORS[d.day], fillOpacity: 1 }).addTo(map);
  }
  if (bounds.length) map.fitBounds(bounds, { padding: [20, 20], maxZoom: 8 });
  else map.setView([35.4, 137.5], 6);
  setTimeout(() => map.invalidateSize(), 80);
  bookMapInst = map;
}

function renderAbout() {
  return `
    ${banner()}
    ${topbar('說明', '這個 DEMO 可以點、不是正式 App')}
    <div class="body with-nav about">
      <div class="card">
        <h2 style="margin:0 0 8px;font-size:18px">這是什麼？</h2>
        <p>「旅行照片整理器」的可點示範。照片、地點、花費、心得都是<strong>範例</strong>，只存在你的瀏覽器（localStorage），沒有後端、也不會連到你的相簿。</p>
      </div>
      <div class="card">
        <h2 style="margin:0 0 8px;font-size:18px">正式版會怎麼做？</h2>
        <p>在手機裡直接讀取你旅行照片的 EXIF 時間與 GPS，依日期和地點自動分組。照片留在裝置上，不必上傳到雲端。</p>
        <p>地圖用 <strong>OpenStreetMap</strong>（免費、不用金鑰）。若改用 Google 地圖，就要申請金鑰並設每日上限，才不會突然產生費用。</p>
        <p>每天的花費示範串接「旅伴帳」——這個 DEMO 裡的數字都標了「範例」，不是真實帳單。</p>
      </div>
      <div class="card">
        <h2 style="margin:0 0 8px;font-size:18px">你可以試這些</h2>
        <p>匯入動畫、時間軸分組、把未定位照片指定地點、在地圖上按圖針、改每天心得、打開旅遊書、按分享旅伴（只會出現示範連結）。</p>
      </div>
      <button class="btn ghost" data-action="reset">恢復範例資料</button>
      <button class="btn ghost" data-action="import">重新體驗匯入</button>
      <p class="hint">範例照片取材自 Wikimedia Commons（自由授權），僅供示範整理效果。</p>
    </div>
    ${nav('about')}`;
}

function renderJoin() {
  return `
    ${banner()}
    ${topbar('旅伴邀請', '示範連結', { back: '#/home' })}
    <div class="body">
      <div class="card">
        <h2 style="margin:0 0 8px;font-size:18px">已開啟邀請（範例）</h2>
        <p class="muted">正式版會請旅伴加入這本相簿。這是 DEMO，不會真的把任何人加進來。</p>
        <p>行程：${esc(TRIP.title)}</p>
        <button class="btn" data-action="skip">查看範例行程</button>
      </div>
    </div>`;
}

function openShare() {
  openSheet(`
    <h2>分享給旅伴</h2>
    <p class="hint">把這趟旅程的相簿邀請傳給同行的人。DEMO 不會真的送出，也不會把朋友加進來。</p>
    <div class="lbl">邀請連結（範例）</div>
    <div class="copybox" id="share-url">${esc(SHARE_URL)}</div>
    <button class="btn" data-action="copy-share">複製連結</button>
    <button class="btn ghost" data-close>關閉</button>
  `);
}

function destroyMaps() {
  if (mapInst) { mapInst.remove(); mapInst = null; }
  if (bookMapInst) { bookMapInst.remove(); bookMapInst = null; }
}

function render() {
  closeDlg();
  destroyMaps();
  const { parts } = route();
  const head = parts[0] || '';
  $app.classList.remove('fill');

  if (head === 'import') {
    $app.innerHTML = renderImport();
    queueMicrotask(() => runImport());
    return;
  }
  if (head === 'join') {
    $app.innerHTML = renderJoin();
    return;
  }
  if (head === 'photo' && parts[1]) {
    $app.innerHTML = renderPhoto(parts[1]);
    return;
  }
  if (!state.imported && head !== 'about') {
    $app.innerHTML = renderWelcome();
    return;
  }

  if (head === 'timeline') {
    $app.innerHTML = renderTimeline();
  } else if (head === 'day' && parts[1]) {
    $app.innerHTML = renderDay(Number(parts[1]));
  } else if (head === 'map') {
    const day = parts[1] ? Number(parts[1]) : 0;
    $app.classList.add('fill');
    $app.innerHTML = renderMap(day || null);
    queueMicrotask(() => mountMap(day || null));
  } else if (head === 'book') {
    $app.innerHTML = renderBook();
    queueMicrotask(() => mountBookMap());
  } else if (head === 'about') {
    $app.innerHTML = renderAbout();
  } else {
    $app.innerHTML = renderHome();
  }
}

$app.addEventListener('click', (e) => {
  const goEl = e.target.closest('[data-go]');
  if (goEl) {
    e.preventDefault();
    go(goEl.getAttribute('data-go'));
    return;
  }
  const md = e.target.closest('[data-mapday]');
  if (md) {
    e.preventDefault();
    const v = md.getAttribute('data-mapday');
    go(v ? '#/map/' + v : '#/map');
    return;
  }
  const act = e.target.closest('[data-action]');
  if (!act) return;
  const action = act.getAttribute('data-action');
  if (action === 'import') {
    e.preventDefault();
    closeDlg();
    go('#/import');
  } else if (action === 'skip') {
    e.preventDefault();
    state.imported = true;
    save();
    go('#/home');
  } else if (action === 'share') {
    e.preventDefault();
    openShare();
  } else if (action === 'copy-share') {
    e.preventDefault();
    copyText(SHARE_URL).then(() => toast('已複製。正式版才會真的邀請旅伴。'), () => toast('請手動複製連結'));
  } else if (action === 'assign') {
    e.preventDefault();
    openAssign(act.getAttribute('data-id'));
  } else if (action === 'assign-to') {
    e.preventDefault();
    state.assigns[act.getAttribute('data-id')] = act.getAttribute('data-place');
    save();
    closeDlg();
    toast('已指定地點（範例）');
    render();
  } else if (action === 'assign-custom') {
    e.preventDefault();
    const input = document.getElementById('custom-place');
    const name = (input && input.value.trim()) || '';
    if (!name) { toast('請先寫地點名稱'); return; }
    state.assigns[act.getAttribute('data-id')] = { custom: name };
    save();
    closeDlg();
    toast('已加上地點名稱');
    render();
  } else if (action === 'reset') {
    e.preventDefault();
    state = { imported: true, notes: {}, assigns: {} };
    save();
    toast('已恢復範例心得與地點');
    go('#/home');
    render();
  }
});

$app.addEventListener('input', (e) => {
  const ta = e.target.closest('textarea[data-note]');
  if (!ta) return;
  const day = Number(ta.getAttribute('data-note'));
  state.notes[day] = ta.value;
  save();
});

$dlg.addEventListener('click', (e) => {
  if (e.target === $dlg || e.target.closest('[data-close]')) {
    if (e.target.closest('a[href]')) {
      closeDlg();
      return;
    }
    e.preventDefault();
    closeDlg();
    return;
  }
  const act = e.target.closest('[data-action]');
  if (!act) return;
  const action = act.getAttribute('data-action');
  if (action === 'copy-share') {
    e.preventDefault();
    copyText(SHARE_URL).then(() => toast('已複製。正式版才會真的邀請旅伴。'), () => toast('請手動複製連結'));
  } else if (action === 'assign-to') {
    e.preventDefault();
    state.assigns[act.getAttribute('data-id')] = act.getAttribute('data-place');
    save();
    closeDlg();
    toast('已指定地點（範例）');
    render();
  } else if (action === 'assign-custom') {
    e.preventDefault();
    const input = document.getElementById('custom-place');
    const name = (input && input.value.trim()) || '';
    if (!name) { toast('請先寫地點名稱'); return; }
    state.assigns[act.getAttribute('data-id')] = { custom: name };
    save();
    closeDlg();
    toast('已加上地點名稱');
    render();
  }
});

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
}

window.addEventListener('hashchange', render);
render();
