if ("serviceWorker" in navigator) {
  let registration;
  let inactivityTimer;
  const inactivityTimeout = 20 * 60 * 1000; // 20 minutes

  const unregisterServiceWorker = () => {
    if (registration) {
      registration.unregister().then((unregistered) => {
        if (unregistered) {
          console.log("Service worker unregistered due to inactivity.");
          // Optional: Reload the page to clear the service worker's control
          // window.location.reload();
        } else {
          console.log("Service worker failed to unregister.");
        }
      });
    }
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(unregisterServiceWorker, inactivityTimeout);
  };

  const setupInactivityDetection = () => {
    // Events that indicate user activity
    const activityEvents = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    // Add event listeners to reset the timer on user activity
    activityEvents.forEach((event) => {
      document.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    // Start the initial timer
    resetInactivityTimer();
  };

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => {
        registration = reg;
        console.log("Service worker registered:", reg);
        setupInactivityDetection();
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  });
}
