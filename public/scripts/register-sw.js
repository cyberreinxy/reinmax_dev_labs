// public/scripts/register-sw.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {

      })
      .catch((error) => {

      });
  });
}
