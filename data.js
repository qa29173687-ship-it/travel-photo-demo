export const TRIP = {
  id: 'jp-2026-spring',
  title: '2026 東京＋京都',
  placeLine: '東京 · 京都',
  start: '2026-11-07',
  end: '2026-11-11',
  cover: 'photos/cover.jpg',
  shareCode: 'TOKYO2026',
  companions: ['小美（範例）'],
};

export const PLACES = {
  narita:    { id: 'narita',    name: '成田機場', city: '東京', lat: 35.7720, lng: 140.3929, emoji: '✈️' },
  sensoji:   { id: 'sensoji',   name: '淺草寺',   city: '東京', lat: 35.7148, lng: 139.7967, emoji: '⛩️' },
  skytree:   { id: 'skytree',   name: '晴空塔',   city: '東京', lat: 35.7101, lng: 139.8107, emoji: '🗼' },
  meiji:     { id: 'meiji',     name: '明治神宮', city: '東京', lat: 35.6764, lng: 139.6993, emoji: '🌲' },
  harajuku:  { id: 'harajuku',  name: '原宿',     city: '東京', lat: 35.6702, lng: 139.7027, emoji: '🛍️' },
  shibuya:   { id: 'shibuya',   name: '澀谷',     city: '東京', lat: 35.6595, lng: 139.7004, emoji: '🚦' },
  fushimi:   { id: 'fushimi',   name: '伏見稻荷', city: '京都', lat: 34.9671, lng: 135.7727, emoji: '🦊' },
  kiyomizu:  { id: 'kiyomizu',  name: '清水寺',   city: '京都', lat: 34.9949, lng: 135.7850, emoji: '🏛️' },
  gion:      { id: 'gion',      name: '祇園',     city: '京都', lat: 35.0036, lng: 135.7750, emoji: '🌙' },
  arashiyama:{ id: 'arashiyama',name: '嵐山',     city: '京都', lat: 35.0136, lng: 135.6778, emoji: '🎋' },
  kinkaku:   { id: 'kinkaku',   name: '金閣寺',   city: '京都', lat: 35.0394, lng: 135.7292, emoji: '🏯' },
  nishiki:   { id: 'nishiki',   name: '錦市場',   city: '京都', lat: 35.0050, lng: 135.7649, emoji: '🍡' },
  nijo:      { id: 'nijo',      name: '二条城',   city: '京都', lat: 35.0142, lng: 135.7482, emoji: '🏯' },
  kyotoSt:   { id: 'kyotoSt',   name: '京都車站', city: '京都', lat: 34.9858, lng: 135.7588, emoji: '🚉' },
};

export const DAYS = [
  {
    day: 1, date: '2026-11-07', title: '抵達東京・淺草',
    spend: 8600, spendNote: '交通＋午餐＋晚餐',
    note: '終於到東京了。雷門的人比想像中還多，仲見世的人形燒很好吃。晚上走到晴空塔附近吹風。',
  },
  {
    day: 2, date: '2026-11-08', title: '明治神宮・原宿・澀谷',
    spend: 11200, spendNote: '午餐＋購物＋晚餐',
    note: '明治神宮的樹林很安靜，一出竹下通又熱鬧起來。晚上站在澀谷十字路口看人潮，像看海。',
  },
  {
    day: 3, date: '2026-11-09', title: '新幹線前往京都',
    spend: 15800, spendNote: '新幹線＋門票＋晚餐',
    note: '新幹線到京都只要兩小時多。千本鳥居要再往上走才比較沒人；清水寺的舞台視野很棒，黃昏的二年坂很美。',
  },
  {
    day: 4, date: '2026-11-10', title: '嵐山・金閣寺',
    spend: 7400, spendNote: '交通＋門票＋午餐',
    note: '竹林建議早去，金閣寺在太陽下閃閃發亮。下午逛錦市場，買了幾樣小點心。',
  },
  {
    day: 5, date: '2026-11-11', title: '二条城・回程',
    spend: 6200, spendNote: '門票＋交通',
    note: '二条城的唐門雕刻好細，庭園很安靜。中午從京都車站出發，一路看著雲回家。',
  },
];

/** Fake EXIF time (+09:00) and GPS. Photos without lat/lng go to 未定位. */
export const PHOTOS = [
  { id:'p01', file:'photos/p01.jpg', time:'2026-11-07T08:42:00+09:00', lat:35.7720, lng:140.3929, placeId:'narita',    caption:'抵達成田機場',     filename:'IMG_2401.JPG' },
  { id:'p02', file:'photos/p02.jpg', time:'2026-11-07T11:18:00+09:00', lat:35.7111, lng:139.7965, placeId:'sensoji',   caption:'淺草雷門',         filename:'IMG_2408.JPG' },
  { id:'p03', file:'photos/p03.jpg', time:'2026-11-07T11:47:00+09:00', lat:35.7147, lng:139.7966, placeId:'sensoji',   caption:'淺草寺本堂',       filename:'IMG_2415.JPG' },
  { id:'p04', file:'photos/p04.jpg', time:'2026-11-07T12:26:00+09:00', lat:35.7126, lng:139.7964, placeId:'sensoji',   caption:'仲見世通小吃',     filename:'IMG_2422.JPG' },
  { id:'p05', file:'photos/p05.jpg', time:'2026-11-07T16:12:00+09:00', lat:35.7100, lng:139.8106, placeId:'skytree',   caption:'晴空塔',           filename:'IMG_2436.JPG' },
  { id:'p06', file:'photos/p06.jpg', time:'2026-11-07T19:05:00+09:00', lat:35.7116, lng:139.7948, placeId:'sensoji',   caption:'淺草夜晚',         filename:'IMG_2451.JPG' },

  { id:'p07', file:'photos/p07.jpg', time:'2026-11-08T09:28:00+09:00', lat:35.6758, lng:139.6994, placeId:'meiji',     caption:'明治神宮鳥居',     filename:'IMG_2460.JPG' },
  { id:'p08', file:'photos/p08.jpg', time:'2026-11-08T09:51:00+09:00', lat:35.6763, lng:139.6998, placeId:'meiji',     caption:'神宮樹林',         filename:'IMG_2467.JPG' },
  { id:'p09', file:'photos/p09.jpg', time:'2026-11-08T11:24:00+09:00', lat:35.6703, lng:139.7028, placeId:'harajuku',  caption:'竹下通',           filename:'IMG_2478.JPG' },
  { id:'p10', file:'photos/p10.jpg', time:'2026-11-08T14:02:00+09:00', lat:35.6595, lng:139.7005, placeId:'shibuya',   caption:'澀谷十字路口',     filename:'IMG_2491.JPG' },
  { id:'p11', file:'photos/p11.jpg', time:'2026-11-08T14:21:00+09:00', lat:35.6591, lng:139.7006, placeId:'shibuya',   caption:'忠犬哈チ公',       filename:'IMG_2496.JPG' },
  { id:'p12', file:'photos/p12.jpg', time:'2026-11-08T20:36:00+09:00', lat:null,    lng:null,    placeId:null,        caption:'澀谷夜景',         filename:'IMG_2512.JPG' },

  { id:'p13', file:'photos/p13.jpg', time:'2026-11-09T09:18:00+09:00', lat:null,    lng:null,    placeId:null,        caption:'新幹線車窗',       filename:'IMG_2518.JPG' },
  { id:'p14', file:'photos/p14.jpg', time:'2026-11-09T12:44:00+09:00', lat:34.9672, lng:135.7726, placeId:'fushimi',   caption:'千本鳥居',         filename:'IMG_2530.JPG' },
  { id:'p15', file:'photos/p15.jpg', time:'2026-11-09T14:08:00+09:00', lat:34.9678, lng:135.7786, placeId:'fushimi',   caption:'稻荷山步道',       filename:'IMG_2544.JPG' },
  { id:'p16', file:'photos/p16.jpg', time:'2026-11-09T16:32:00+09:00', lat:34.9948, lng:135.7851, placeId:'kiyomizu',  caption:'清水寺舞台',       filename:'IMG_2561.JPG' },
  { id:'p17', file:'photos/p17.jpg', time:'2026-11-09T17:18:00+09:00', lat:34.9964, lng:135.7821, placeId:'kiyomizu',  caption:'二年坂',           filename:'IMG_2570.JPG' },
  { id:'p18', file:'photos/p18.jpg', time:'2026-11-09T19:42:00+09:00', lat:35.0036, lng:135.7751, placeId:'gion',      caption:'祇園白川',         filename:'IMG_2583.JPG' },

  { id:'p19', file:'photos/p19.jpg', time:'2026-11-10T09:16:00+09:00', lat:35.0095, lng:135.6669, placeId:'arashiyama',caption:'嵐山竹林',         filename:'IMG_2591.JPG' },
  { id:'p20', file:'photos/p20.jpg', time:'2026-11-10T10:38:00+09:00', lat:35.0135, lng:135.6777, placeId:'arashiyama',caption:'渡月橋',           filename:'IMG_2602.JPG' },
  { id:'p21', file:'photos/p21.jpg', time:'2026-11-10T14:04:00+09:00', lat:35.0395, lng:135.7293, placeId:'kinkaku',   caption:'金閣寺',           filename:'IMG_2618.JPG' },
  { id:'p22', file:'photos/p22.jpg', time:'2026-11-10T14:27:00+09:00', lat:35.0393, lng:135.7295, placeId:'kinkaku',   caption:'鏡湖池倒影',       filename:'IMG_2624.JPG' },
  { id:'p23', file:'photos/p23.jpg', time:'2026-11-10T17:05:00+09:00', lat:35.0051, lng:135.7648, placeId:'nishiki',   caption:'錦市場',           filename:'IMG_2637.JPG' },

  { id:'p24', file:'photos/p24.jpg', time:'2026-11-11T09:28:00+09:00', lat:35.0143, lng:135.7481, placeId:'nijo',      caption:'二条城唐門',       filename:'IMG_2645.JPG' },
  { id:'p25', file:'photos/p25.jpg', time:'2026-11-11T10:12:00+09:00', lat:35.0140, lng:135.7476, placeId:'nijo',      caption:'二之丸庭園',       filename:'IMG_2653.JPG' },
  { id:'p26', file:'photos/p26.jpg', time:'2026-11-11T13:22:00+09:00', lat:34.9859, lng:135.7587, placeId:'kyotoSt',   caption:'京都車站',         filename:'IMG_2661.JPG' },
  { id:'p27', file:'photos/p27.jpg', time:'2026-11-11T16:08:00+09:00', lat:null,    lng:null,    placeId:null,        caption:'回程的雲',         filename:'IMG_2668.JPG' },
];

export const DAY_COLORS = {
  1: '#C6452D',
  2: '#1C3D5A',
  3: '#3F6F5B',
  4: '#C4A35A',
  5: '#6B4C9A',
};

const WEEK = '日一二三四五六';

export function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const w = WEEK[new Date(y, m - 1, d).getDay()];
  return `${y}年${m}月${d}日（${w}）`;
}

export function formatDateShort(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const w = WEEK[new Date(y, m - 1, d).getDay()];
  return `${m}月${d}日（${w}）`;
}

export function dateOf(iso) {
  return iso.slice(0, 10);
}

export function timeHm(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('zh-TW', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Tokyo',
  });
}

export function yen(n) {
  return '¥' + Number(n).toLocaleString('ja-JP');
}

export function totalSpend() {
  return DAYS.reduce((s, d) => s + d.spend, 0);
}

export function photoById(id) {
  return PHOTOS.find((p) => p.id === id);
}

export function dayByDate(isoDate) {
  return DAYS.find((d) => d.date === isoDate);
}

export function dayOfPhoto(photo) {
  return dayByDate(dateOf(photo.time));
}
