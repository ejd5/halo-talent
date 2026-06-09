self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};

  const options = {
    body: data.body || "",
    icon: data.icon || "/default-icon.svg",
    badge: data.badge || "/badge.svg",
    image: data.image,
    vibrate: data.vibrate || [200, 100, 200],
    data: {
      url: data.url || "/",
      campaignId: data.campaignId,
      clickTrackUrl: data.clickTrackUrl,
    },
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Nouvelle notification", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const clickData = event.notification.data;

  // Track click (fire and forget)
  if (clickData?.clickTrackUrl) {
    fetch(clickData.clickTrackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId: clickData.campaignId,
      }),
    }).catch(() => {});
  }

  // Open target URL
  const url = clickData?.url || "/";
  event.waitUntil(
    clients.openWindow(url)
  );
});
