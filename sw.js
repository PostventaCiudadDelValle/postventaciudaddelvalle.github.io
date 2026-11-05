// Postventa · Ciudad del Valle — service worker
// Muestra las notificaciones de recordatorio y abre la app al tocarlas.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL("./#recordatorios", self.registration.scope).href;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const w of wins) {
      if ("focus" in w) {
        try { if ("navigate" in w) await w.navigate(url); } catch (_) {}
        return w.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});

// Preparado para notificaciones push desde el servidor (fase siguiente)
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "Postventa", {
    body: d.body || "", icon: "icon-192.png", badge: "icon-192.png", tag: d.tag, requireInteraction: true
  }));
});
