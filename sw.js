// ديجيجو — service worker: يخلّي البرنامج يتسطب، ودايمًا يجيب أحدث نسخة من النت
// (الصفحات من النت الأول، ولو النت فاصل يفتح آخر نسخة محفوظة). بيانات Firebase مش بتتخزن هنا.
const CACHE = 'digigo-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // Firebase / Gemini / الخطوط: من النت مباشرة
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
