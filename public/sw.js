const CACHE_STATIC_NAME = "static-v2";
const CACHE_DYNAMIC_NAME = "dynamic-v2";

const staticAssets = [
  // Core
  "/",
  "/index.html",

  // Styles
  "/styles/bitto.css",
  "/styles/main.css",
  "/styles/tailwind.css",

  // Scripts
  "/scripts/bitto/api-endpoint.js",
  "/scripts/bitto/knowledge-base.js",
  "/scripts/bitto/visual-design.js",
  "/scripts/image-fallback.js",
  "/scripts/main.js",
  "/scripts/register-sw.js",
  "/scripts/script.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",

  // Fonts
  "/fonts/Bricolage-Grotesque/bricolage-grotesque-latin-200-normal.woff2",
  "/fonts/Bricolage-Grotesque/bricolage-grotesque-latin-300-normal.woff2",
  "/fonts/Bricolage-Grotesque/bricolage-grotesque-latin-400-normal.woff2",
  "/fonts/Bricolage-Grotesque/bricolage-grotesque-latin-500-normal.woff2",
  "/fonts/Bricolage-Grotesque/bricolage-grotesque-latin-600-normal.woff2",
  "/fonts/Bricolage-Grotesque/bricolage-grotesque-latin-700-normal.woff2",
  "/fonts/Bricolage-Grotesque/bricolage-grotesque-latin-800-normal.woff2",
  "/fonts/Space-Grotesk/space-grotesk-latin-300-normal.woff2",
  "/fonts/Space-Grotesk/space-grotesk-latin-400-normal.woff2",
  "/fonts/Space-Grotesk/space-grotesk-latin-500-normal.woff2",
  "/assets/fonts/Space-Grotesk/space-grotesk-latin-600-normal.woff2",
  "/fonts/Space-Grotesk/space-grotesk-latin-700-normal.woff2",

  // Images
  "/assets/gif/motion-graphics.gif",
  "/assets/people/henry.webp",
  "/assets/people/klerry.jpg",
  "/assets/people/maggie.webp",
  "/assets/people/placeholder.jpg",
  "/assets/people/reinhard.jpg",
  "/assets/webp/accordion/brainstorming.webp",
  "/assets/webp/accordion/discovery.webp",
  "/assets/webp/accordion/note-taking.webp",
  "/assets/webp/accordion/satisfaction.webp",
  "/assets/webp/accordion/sketching.webp",
  "/assets/webp/accordion/work-delivery.webp",
  "/assets/webp/branding.webp",
  "/assets/webp/design.webp",
  "/assets/webp/draw.webp",
  "/assets/webp/hero.webp",
  "/assets/webp/illustration.webp",
  "/assets/webp/logomark.webp",
  "/assets/webp/ui.webp",

  // Icons
  "/assets/ico/favicon.ico",
  "/assets/ico/favicon.svg",
  "/assets/svg/404.svg",
  "/assets/svg/disconnected.svg",
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

  // For same-origin assets (CSS, JS, images, etc.), use Stale-While-Revalidate.
  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
            // Check for a valid response before caching
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
          });
          return networkResponse;
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
