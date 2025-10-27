/**
 * Handles image loading errors by replacing the src with a fallback URL.
 * This script respects Content-Security-Policy by avoiding inline 'onerror' attributes.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Select all images that have a specified fallback source.
  const imagesWithFallback = document.querySelectorAll(
    "img[data-fallback-src]"
  );

  imagesWithFallback.forEach((img) => {
    img.addEventListener("error", () => {
      const fallbackSrc = img.getAttribute("data-fallback-src");
      if (img.src !== fallbackSrc) {
        // Set the source to the fallback URL.
        img.src = fallbackSrc;
      }
    });
  });
});
