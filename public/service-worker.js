const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";

const staticAssets = [
  // Core
  "/",
  "/index.html",

  // Styles
  "/styles/bitto.css",
  "/styles/main.css",
  "/styles/tailwind.css",

  // Scripts
  "/scripts/bitto/api-endpoint.mjs",
  "/scripts/bitto/knowledge-base.mjs",
  "/scripts/bitto/visual-design.mjs",
  "/scripts/register-sw.js",
  "/scripts/script.js",
  "/scripts/booking.js",

  // Fonts
  "/assets/fonts/Bricolage-Grotesque/bricolage-grotesque-latin-400-normal.woff2",
  "/assets/fonts/Bricolage-Grotesque/bricolage-grotesque-latin-500-normal.woff2",
  "/assets/fonts/Bricolage-Grotesque/bricolage-grotesque-latin-600-normal.woff2",
  "/assets/fonts/Bricolage-Grotesque/bricolage-grotesque-latin-700-normal.woff2",
  "/assets/fonts/Space-Grotesk/space-grotesk-latin-400-normal.woff2",
  "/assets/fonts/Space-Grotesk/space-grotesk-latin-500-normal.woff2",
  "/assets/fonts/Space-Grotesk/space-grotesk-latin-700-normal.woff2",

  // Images
  "/assets/webp/hero.webp",
  "/assets/webp/accordion/brainstorming.webp",
  "/assets/webp/accordion/discovery.webp",
  "/assets/webp/accordion/note-taking.webp",
  "/assets/webp/accordion/satisfaction.webp",
  "/assets/webp/accordion/sketching.webp",
  "/assets/webp/accordion/work-delivery.webp",
  "/assets/webp/draw.webp",

  // Icons
  "/assets/svg/figma.svg",
  "/assets/svg/illustrator.svg",
  "/assets/svg/photoshop.svg",

  // Fallback Pages
  "/404.html",
  "/offline.html",
];

// Cache static assets on install
self.addEventListener("install", (event) => {
  if (self.location.hostname === "localhost") {
    console.log(
      "[Service Worker] Development mode: Service Worker not activated."
    );
    return;
  }

  console.log("[Service Worker] Installing Service Worker ...", event);
  event.waitUntil(
    caches
      .open(CACHE_STATIC_NAME)
      .then((cache) => {
        console.log("[Service Worker] Pre-caching App Shell");
        return cache.addAll(staticAssets);
      })
      .catch((err) =>
        console.error("[Service Worker] Pre-caching failed:", err)
      )
  );
  self.skipWaiting(); // Force the new service worker to activate immediately
});

// Clear old caches on activate
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker ....", event);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      const expectedCacheNames = new Set([
        CACHE_STATIC_NAME,
        CACHE_DYNAMIC_NAME,
      ]);
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!expectedCacheNames.has(cacheName)) {
            console.log("[Service Worker] Removing old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Ensures the service worker takes control immediately
});

// Network-first, falling back to cache for navigation. Stale-while-revalidate for other assets.
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // For HTML pages (navigation requests), try the network first.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Ensure offline.html is returned if no other match is found.
        return await caches.match("/offline.html");
      })
    );
    return;
  }

  // Network-first for blog API
  if (requestUrl.pathname === "/api/blog") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Check if the response is valid before cloning and caching
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          return cachedResponse;
        })
    );
    return;
  }

  // For same-origin assets (CSS, JS, images, etc.), use Stale-While-Revalidate.
  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Check if the response is valid before cloning and caching
            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type !== "basic"
            ) {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          })
          .catch((err) => {
            console.error("[Service Worker] Fetch error:", err);
            // If both cache and network fail, return cached response or error
            return (
              cachedResponse || new Response("Network error", { status: 503 })
            );
          });
        // Return cached response if available, otherwise wait for the network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // For all other cross-origin requests (like CDNs), just fetch from the network.
  // Do not attempt to cache them as it can lead to CORS issues and opaque responses.
  event.respondWith(fetch(event.request));
});
