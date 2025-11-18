/**
 * @file Manages all dynamic functionality for the Reinmax Creative website.
 * @author Reinhard Baraka
 * @version 1.0
 */

// --- 1. GLOBAL UTILITIES & CONFIGURATION ---



/**
 * Sets CSS variable --vh to real viewport height for mobile browser compatibility.
 */
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.addEventListener("resize", setViewportHeight);
setViewportHeight();
window.addEventListener("orientationchange", () => {
  setTimeout(setViewportHeight, 250);
});

/**
 * Sets CSS variable for scrollbar width to prevent layout shifts.
 */
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
document.documentElement.style.setProperty(
  "--scrollbar-width",
  `${scrollbarWidth}px`
);

// --- 2. MAIN APPLICATION OBJECT ---

/** Main application controller for all dynamic functionality. */
const App = {
  isLoaded: false,
  popupHasBeenDismissed: false,
  elements: {}, // Cached DOM elements

  /**
   * Main initialization function.
   * Runs all setup methods in order.
   */
  init() {


    this.cacheDOMElements();

    // Run all initializers
    this.initLucideIcons();
    this.initHeroAnimation();
    this.initMobileMenu();
    this.initNavScroll();
    this.initPlanButtons();
    this.initWorkflowSection();
    this.initFooter();
    this.initPillarGridObserver();
    this.initWorkflowGridObserver();
    this.initCoursePopup();
    this.triggerCoursePopup();
    this.initGenericAnimators();
    this.handleMobileMenuResize();


  },

  /**
   * Caches frequently used DOM elements.
   */
  cacheDOMElements() {

    this.elements.desktopNav = document.getElementById("desktop-nav-container");
    this.elements.mobileNavContainer = document.getElementById(
      "mobile-nav-container"
    );
    this.elements.heroSection = document.getElementById("home");
  },

  /**
   * Renders Lucide icons.
   */
  initLucideIcons() {
    try {
      if (window.lucide && typeof lucide.createIcons === "function") {
        lucide.createIcons();

      }
    } catch (err) {

    }
  },

  /**
   * Handles dynamic phrase animation in hero area.
   */
  initHeroAnimation() {

    const phrases = [
      "is widely recognized",
      "earns loyal customers",
      "influences perception",
      "defines key trends",
    ];

    const dynamicWordElement = document.getElementById("dynamic-word");
    if (!dynamicWordElement) {

      return;
    }
    let phraseIndex = 0;
    const animationDuration = 1500;
    const intervalDuration = 6000;

    function changePhrase() {
      dynamicWordElement.classList.remove("slide-in-up-anim");
      dynamicWordElement.classList.add("slide-out-down-anim");

      setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        dynamicWordElement.textContent = phrases[phraseIndex];
        dynamicWordElement.classList.remove("slide-out-down-anim");
        dynamicWordElement.classList.add("slide-in-up-anim");
      }, animationDuration);
    }

    dynamicWordElement.textContent = phrases[phraseIndex];
    dynamicWordElement.classList.add("slide-in-up-anim");

    setInterval(changePhrase, intervalDuration);
  },

  /**
   * Initializes mobile menu toggle and panel logic.
   */
  initMobileMenu() {

    const mobileMenuButton = document.getElementById("menu-toggle");
    const mobileMenuPanel = document.getElementById("mobile-menu");

    if (mobileMenuButton && mobileMenuPanel) {
      mobileMenuButton.addEventListener("click", () => {
        const isExpanded =
          mobileMenuButton.getAttribute("aria-expanded") === "true";

        this.toggleMobileMenu(!isExpanded);
      });

      // Close menu when a link is clicked
      mobileMenuPanel.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (link) {
          e.preventDefault();
          const href = link.getAttribute("href");
          this.toggleMobileMenu(false);
          setTimeout(() => {
            if (href) {
              if (href.startsWith("#")) {
                document.querySelector(href).scrollIntoView();
              } else {
                window.location.href = href;
              }
            }
          }, 150); // Start scrolling when menu is a quarter way closed
        }
      });

      // Close menu when clicking outside of it
      document.addEventListener("click", (e) => {
        const isMenuOpen =
          mobileMenuButton.getAttribute("aria-expanded") === "true";
        const isClickInsideMenu = mobileMenuPanel.contains(e.target);
        const isClickOnToggleButton = mobileMenuButton.contains(e.target);
        if (isMenuOpen && !isClickInsideMenu && !isClickOnToggleButton) {
          this.toggleMobileMenu(false);
        }
      });
    } else {

    }
  },

  /** Toggles the visibility of the mobile menu. */
  toggleMobileMenu(show) {
    const mobileMenuButton = document.getElementById("menu-toggle");
    const mobileMenuPanel = document.getElementById("mobile-menu");
    mobileMenuButton.setAttribute("aria-expanded", show);
    mobileMenuButton.classList.toggle("is-open", show);
    mobileMenuPanel.classList.toggle("open", show);

    if (show) {
      mobileMenuPanel.classList.remove("is-hidden");
      mobileMenuPanel.classList.add("is-opening");
    } else {
      mobileMenuPanel.classList.remove("is-opening");
      setTimeout(() => {
        mobileMenuPanel.classList.add("is-hidden");
      }, 150); // Match the transition duration
    }
  },

  /**
   * Handles desktop and mobile navigation scroll effects.
   */
  initNavScroll() {

    const { desktopNav, mobileNavContainer, heroSection } = this.elements;
    const scrollThreshold = 10;
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    if (!desktopNav || !mobileNavContainer || !heroSection) {

      return;
    }

    const updateNavState = () => {
      const scrollY = window.scrollY;
      if (scrollY > scrollThreshold) {
        desktopNav.classList.add("scrolled");
        mobileNavContainer.classList.add("scrolled");
      } else {
        desktopNav.classList.remove("scrolled");
        mobileNavContainer.classList.remove("scrolled");
      }

      let currentSection = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
          currentSection = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        const linkHref = link.getAttribute("href");

        if (linkHref === `#${currentSection}`) {
          link.classList.add("active");
        } else if (
          linkHref === "#cores" &&
          (currentSection === "cores" || currentSection === "team")
        ) {
          link.classList.add("active");
        } else if (
          linkHref === "#services" &&
          (currentSection === "services" || currentSection === "workflow")
        ) {
          link.classList.add("active");
        }
      });
    };

    updateNavState();

    window.addEventListener("scroll", updateNavState);
  },

  /**
   * Directs to checkout page on plan/course button clicks.
   */
  initPlanButtons() {

    const planButtons = document.querySelectorAll("[branding-plan]");
    const courseButtons = document.querySelectorAll("[courses-plan]");

    planButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const branding = button.getAttribute("branding-plan");

        if (branding) {
          window.location.href = `/checkout.html?branding=${branding}`;
        }
      });
    });

    courseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const course = button.getAttribute("courses-plan");

        if (course) {
          window.location.href = `/checkout.html?course=${course}`;
        }
      });
    });
  },

  /**
   * Manages the interactive UI of the workflow/process section.
   */
  initWorkflowSection() {

    const section = document.getElementById("workflow");
    if (!section) {

      return;
    }

    const allSteps = section.querySelectorAll(".process-step");
    const desktopImages = section.querySelectorAll(
      ".visual-preview-area .preview-image"
    );
    const desktopDescriptions = section.querySelectorAll(
      ".visual-preview-area .preview-description"
    );
    const stepsList = section.querySelector(".process-steps-list");
    const imageContainer = section.querySelector(
      ".visual-preview-area .image-container"
    );
    const workflowGrid = section.querySelector(".workflow-grid");

    let activeIndex = -1;

    const updatePreviewHeight = () => {
      if (window.innerWidth >= 1024 && stepsList && imageContainer) {
        imageContainer.style.height = `${stepsList.offsetHeight}px`;
      } else if (imageContainer) {
        imageContainer.style.height = "";
      }
    };

    const updateUI = () => {
      allSteps.forEach((step, i) => {
        step.classList.toggle("is-active", i === activeIndex);
      });

      if (window.innerWidth >= 1024) {
        if (imageContainer) {
          imageContainer.classList.toggle(
            "is-default-state",
            activeIndex === -1
          );
        }
        desktopImages.forEach((img) => {
          const imgIndex = parseInt(img.dataset.index, 10);
          img.classList.toggle(
            "is-active",
            imgIndex === activeIndex || (activeIndex === -1 && imgIndex === -1)
          );
        });
        desktopDescriptions.forEach((desc) => {
          const descIndex = parseInt(desc.dataset.index, 10);
          desc.classList.toggle("is-active", descIndex === activeIndex);
        });
      } else {
        if (imageContainer) {
          imageContainer.classList.remove("is-default-state");
        }
      }
      updatePreviewHeight();
    };

    allSteps.forEach((step) => {
      const header = step.querySelector(".process-step-header");
      const index = parseInt(step.dataset.index, 10);
      header.addEventListener("click", (e) => {
        e.stopPropagation();
        activeIndex = activeIndex === index ? -1 : index;
        updateUI();
      });
    });

    document.addEventListener("click", (e) => {
      if (
        workflowGrid &&
        !workflowGrid.contains(e.target) &&
        activeIndex !== -1
      ) {
        activeIndex = -1;
        updateUI();
      }
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateUI();
      }, 100);
    });

    window.addEventListener("load", () => {
      activeIndex = -1;
      updateUI();
    });
  },

  /**
   * Initializes the AI course popup, including form validation and visibility controls.
   */
  initCoursePopup() {

    const popup = document.getElementById("ai-course-popup");
    if (!popup) {

      return;
    }

    const elements = {
      closeBtn: document.getElementById("ai-course-popup-close-btn"),
      form: document.getElementById("ai-course-popup-form"),
      emailInput: document.getElementById("ai-course-popup-email-input"),
      imgBox: document.getElementById("ai-course-popup-image-container"),
      contentBox: document.getElementById("ai-course-popup-content-container"),
    };
    if (Object.values(elements).some((el) => !el)) return;

    const defaultPlaceholder = elements.emailInput.placeholder;

    // Match image container height to content container on desktop.
    const matchHeight = () => {
      if (window.innerWidth >= 1024 && elements.contentBox.offsetHeight > 0) {
        elements.imgBox.style.height = `${elements.contentBox.offsetHeight}px`;
      } else {
        elements.imgBox.style.height = "";
      }
    };

    const resetForm = () => {
      elements.emailInput.value = "";
      elements.emailInput.classList.remove(
        "ring-2",
        "ring-red-500",
        "ai-course-popup-placeholder-red"
      );
      elements.emailInput.placeholder = defaultPlaceholder;
    };

    const togglePopup = (show) => {
      if (!show) App.popupHasBeenDismissed = true;
      popup.classList.toggle("visible", show);
      if (show) {
        resetForm();
        setTimeout(matchHeight, 50);
      }
    };
    popup.togglePopupVisibility = togglePopup;

    const showError = (msg) => {
      elements.form.classList.add("ai-course-popup-form-shake");
      elements.emailInput.classList.add(
        "ring-2",
        "ring-red-500",
        "ai-course-popup-placeholder-red"
      );
      elements.emailInput.value = "";
      elements.emailInput.placeholder = msg;
      setTimeout(
        () => elements.form.classList.remove("ai-course-popup-form-shake"),
        600
      );
    };

    elements.closeBtn.addEventListener("click", () => togglePopup(false));
    window.addEventListener("resize", () => {
      if (popup.classList.contains("visible")) matchHeight();
    });

    elements.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!elements.emailInput.value.trim())
        return showError("Email address is required");
      if (!elements.form.checkValidity())
        return showError("Please enter a valid email address");

      const userEmail = encodeURIComponent(elements.emailInput.value);
      window.location.href = `checkout.html?course=illustrator&email=${userEmail}`;
    });

    elements.emailInput.addEventListener("focus", () => {
      elements.emailInput.scrollIntoView({ behavior: "smooth", block: "center" });
      resetForm();
    });
  },

  /**
   * Triggers the course popup based on scroll position (when user is between hero and footer).
   */
  triggerCoursePopup() {

    const popup = document.getElementById("ai-course-popup");
    const hero = document.getElementById("home");
    const footer = document.getElementById("footer");

    if (!popup || !hero || !footer) {

      return;
    }

    if (this.popupHasBeenDismissed) {

      return;
    }

    let popupTimer = null;
    let isHeroVisible = true;
    let isFooterVisible = false;

    const checkAndManageTimer = () => {
      if (
        !popup.classList.contains("visible") &&
        !this.popupHasBeenDismissed &&
        !isHeroVisible &&
        !isFooterVisible
      ) {
        if (!popupTimer) {
          popupTimer = setTimeout(() => {
            popup.togglePopupVisibility(true);
          }, 5500);
        }
      } else {
        if (popupTimer) {
          clearTimeout(popupTimer);
          popupTimer = null;
        }
        if (
          popup.classList.contains("visible") &&
          (isHeroVisible || isFooterVisible)
        ) {
          popup.togglePopupVisibility(false);
        }
      }
    };

    const zoneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hero)
            isHeroVisible = entry.intersectionRatio > 0;
          if (entry.target === footer)
            isFooterVisible = entry.intersectionRatio > 0;
        });
        checkAndManageTimer();
      },
      { threshold: [0, 0.3] }
    );

    zoneObserver.observe(hero);
    zoneObserver.observe(footer);
  },

  /**
   * Initializes footer elements, such as the copyright year.
   */
  initFooter() {

    this.updateCopyrightYear();
  },

  /**
   * Updates copyright year in footer.
   */
  updateCopyrightYear() {
    const yearElement = document.getElementById("copyright-year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();
  },

  /**
   * Sets up an IntersectionObserver to trigger animations for the pillar grid.
   */
  initPillarGridObserver() {

    const grid = document.querySelector(".pillar-grid");
    if (!grid) {

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(grid);
  },

  /**
   * Sets up an IntersectionObserver to trigger animations for the workflow grid.
   */
  initWorkflowGridObserver() {

    const wrapper = document.querySelector(".workflow-section-wrapper");
    if (!wrapper) {

      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(wrapper);
  },

  /**
   * Initializes a generic IntersectionObserver for all '.animate-on-scroll' elements.
   */
  initGenericAnimators() {

    const elements = document.querySelectorAll(".animate-on-scroll");
    if (!elements.length) {

      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
  },
  /**
   * Manages mobile menu visibility based on screen size.
   */
  handleMobileMenuResize() {
    const mobileMenuPanel = document.getElementById("mobile-menu");
    const mobileNavContainer = document.getElementById("mobile-nav-container");
    const mobileMenuButton = document.getElementById("menu-toggle");

    if (!mobileMenuPanel || !mobileNavContainer || !mobileMenuButton) {

      return;
    }

    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        // Desktop size
        if (mobileMenuPanel.classList.contains("open")) {
          this.toggleMobileMenu(false); // Close if open
        }
        // Ensure mobile menu is hidden on desktop
        mobileMenuPanel.style.display = "none";
        mobileNavContainer.style.display = "none";
      } else {
        // Mobile size
        // Allow CSS to control visibility on mobile
        mobileMenuPanel.style.display = "";
        mobileNavContainer.style.display = "";
      }
    };

    // Initial check on load
    checkScreenSize();

    // Add event listener for resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkScreenSize, 100);
    });
  },
};

// --- 3. APPLICATION ENTRY POINT ---

/**
 * Single entry point for the application.
 * Waits for the DOM to be ready, then initializes the App.
 */
document.addEventListener("DOMContentLoaded", () => {

  App.init();
});


/**
 * Handles image loading errors by replacing the src with a fallback URL.
 * This script respects Content-Security-Policy by avoiding inline 'onerror' attributes.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Select all images that have a specified fallback source.
  const imagesWithFallback = document.querySelectorAll(
    "img[data-fallback-src]",
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