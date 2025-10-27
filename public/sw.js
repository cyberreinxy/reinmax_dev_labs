const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";

const staticAssets = [
  "/",
  "/index.html",
  "/styles/main.css",
  "/styles/bitto.css",
  "/styles/tailwind.css",
  "/scripts/script.js",
  "/scripts/main.js",
  "/scripts/image-fallback.js",
  "/scripts/register-sw.js",
  "/scripts/bitto/visual-design.js",
  "/scripts/bitto/api-endpoint.js",
  "/scripts/bitto/knowledge-base.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js", // Cache critical third-party script
  "/assets/webp/hero.webp",
  "/assets/people/reinhard.jpg",
  "/assets/people/placeholder.jpg",
  "/assets/people/henry.webp",
  "/assets/people/klerry.jpg",
  "/assets/people/maggie.webp",
  "/assets/webp/accordion/note-taking.webp",
  "/assets/webp/accordion/discovery.webp",
  "/assets/webp/accordion/brainstorming.webp",
  "/assets/webp/accordion/sketching.webp",
  "/assets/webp/accordion/satisfaction.webp",
  "/assets/webp/accordion/work-delivery.webp",
  "/assets/webp/branding.webp",
  "/assets/webp/ui.webp",
  "/assets/webp/illustration.webp",
  "/assets/gif/motion-graphics.gif",
  "/assets/webp/logomark.webp",
  "/assets/webp/design.webp",
  "/assets/svg/illustrator.svg",
  "/assets/svg/photoshop.svg",
  "/assets/svg/figma.svg",
  "/assets/ico/favicon.svg",
  "/assets/ico/favicon.ico",
  "/assets/webp/draw.webp",
  // Add an offline fallback page if desired (e.g., '/offline.html')
];

// Cache static assets on install
self.addEventListener("install", (event) => {
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
});

// Clear old caches on activate
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker ....", event);
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Ensures the service worker takes control immediately
});

// Serve from Cache, then fetch from Network (Cache-First strategy)
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return; // Let the browser handle it directly
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Found in cache (static or dynamic)
      } else {
        // Not in cache, go to network
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response before caching
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Clone the response because a response can only be consumed once
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          })
          .catch(() => {
            // Network request failed. Try to find a fallback.
            // If it's a navigation request (for an HTML page), serve an offline page.
            if (event.request.mode === "navigate") {
              // return caches.match('/offline.html'); // Uncomment if you create an offline.html
              // For now, a simple offline message
              return new Response(
                "<h1>You are offline!</h1><p>Please check your internet connection.</p>",
                {
                  headers: { "Content-Type": "text/html" },
                }
              );
            }
            // For other types of requests (images, scripts, etc.), if network fails
            // and it wasn't in cache, we can't do much. The browser will show its default error.
            return new Response(null, {
              status: 503,
              statusText: "Service Unavailable",
            });
          });
      }
    })
  );
});
