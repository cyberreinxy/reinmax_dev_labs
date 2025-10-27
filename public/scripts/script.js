/**
 * @file Manages all dynamic functionality for the Reinmax Creative website.
 * @author Reinhard Baraka
 * @version 1.0
 */

/*-------------------------------------------*/
/*    1. GLOBAL UTILITIES & CONFIGURATION    */
/*-------------------------------------------*/

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

/*------------------------------------*/
/*    2. MAIN APPLICATION OBJECT      */
/*------------------------------------*/

// Main App object for all application logic
const App = {
  isLoaded: false,
  popupHasBeenDismissed: false,

  // Initializes all modules and features
  init() {
    try {
      if (window.lucide && typeof lucide.createIcons === "function") {
        lucide.createIcons();
      }
    } catch (err) {
      console.warn("lucide.createIcons() failed in App.init:", err);
    }
    this.initWorkflowSection();
    this.keepHeroImageInMemory();
    this.initFooter();
    this.initPillarGridObserver();
    this.initWorkflowGridObserver();
    this.initCoursePopup();
    this.triggerCoursePopup();
    this.initGenericAnimators();
  },

  // Ensures hero image stays in memory
  keepHeroImageInMemory() {
    const heroImage = document.querySelector('#home img[priority="high"]');
    if (!heroImage) return;

    const keepAlive = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      canvas.style.position = "fixed";
      canvas.style.top = "-10px";
      canvas.style.left = "-10px";
      canvas.getContext("2d").drawImage(heroImage, 0, 0, 1, 1);
    };

    heroImage.complete
      ? keepAlive()
      : heroImage.addEventListener("load", keepAlive);
  },

  // Handles the interactive workflow section
  initWorkflowSection() {
    const section = document.getElementById("workflow");
    if (!section) return;

    // Get all interactive elements
    const allSteps = Array.from(section.querySelectorAll(".process-step"));
    const desktopImages = Array.from(
      section.querySelectorAll(".visual-preview-area .preview-image")
    );
    const desktopDescriptions = Array.from(
      section.querySelectorAll(".visual-preview-area .preview-description")
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
        updateUI(); // This will re-evaluate everything on resize end
      }, 100);
    });

    window.addEventListener("load", () => {
      activeIndex = -1;
      updateUI();
    });
  },

  // Handles all logic for the AI (Adobe Illustrator) course popup (form, validation, visibility)
  initCoursePopup() {
    const popup = document.getElementById("ai-course-popup");
    if (!popup) return;

    const elements = {
      closeBtn: document.getElementById("ai-course-popup-close-btn"),
      form: document.getElementById("ai-course-popup-form"),
      emailInput: document.getElementById("ai-course-popup-email-input"),
      imgBox: document.getElementById("ai-course-popup-image-container"),
      contentBox: document.getElementById("ai-course-popup-content-container"),
    };
    if (Object.values(elements).some((el) => !el)) return;

    const defaultPlaceholder = elements.emailInput.placeholder;

    // Match image container height to content container for desktop
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

    elements.emailInput.addEventListener("focus", resetForm);
  },

  // Shows course popup based on scroll position (between hero and footer)
  triggerCoursePopup() {
    const popup = document.getElementById("ai-course-popup");
    const hero = document.getElementById("home");
    const footer = document.getElementById("footer");

    if (!popup || !hero || !footer || this.popupHasBeenDismissed) return;

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

  // Footer scripts (copyright year)
  initFooter() {
    this.updateCopyrightYear();
  },

  // Updates copyright year in footer
  updateCopyrightYear() {
    const yearElement = document.getElementById("copyright-year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();
  },

  // Triggers animations for pillar grid
  initPillarGridObserver() {
    const grid = document.querySelector(".pillar-grid");
    if (!grid) return;

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

  // Triggers workflow grid animations
  initWorkflowGridObserver() {
    const wrapper = document.querySelector(".workflow-section-wrapper");
    if (!wrapper) return;

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

  // Generic intersection observer for animation on scroll
  initGenericAnimators() {
    const elements = document.querySelectorAll(".animate-on-scroll");
    if (!elements.length) return;

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
};

/*--------------------------------------------------*/
/*    3. STANDALONE UI MODULES & EVENT LISTENERS    */
/*--------------------------------------------------*/

// Handles dynamic phrase animation in hero area
document.addEventListener("DOMContentLoaded", function () {
  const phrases = [
    "is widely recognized",
    "earns loyal customers",
    "influences perception",
    "defines key trends",
  ];

  const dynamicWordElement = document.getElementById("dynamic-word");
  if (!dynamicWordElement) return;
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
});

//================================================
// Desktop and mobile navigation scroll effect
//================================================
/*-- --*/
document.addEventListener("DOMContentLoaded", () => {

  // --- Mobile Menu Logic ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenuPanel = document.getElementById("mobile-menu-panel");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () => {
      const isExpanded =
        mobileMenuButton.getAttribute("aria-expanded") === "true";
      mobileMenuButton.setAttribute("aria-expanded", !isExpanded);

      hamburgerIcon.classList.toggle("hidden");
      closeIcon.classList.toggle("hidden");

      if (!isExpanded) {
        mobileMenuPanel.classList.remove(
          "opacity-0",
          "scale-95",
          "pointer-events-none"
        );
        mobileMenuPanel.classList.add(
          "opacity-100",
          "scale-100",
          "pointer-events-auto"
        );
      } else {
        mobileMenuPanel.classList.remove(
          "opacity-100",
          "scale-100",
          "pointer-events-auto"
        );
        mobileMenuPanel.classList.add(
          "opacity-0",
          "scale-95",
          "pointer-events-none"
        );
      }
    });
  }
});

const desktopNavContainer = document.getElementById("desktop-nav-container");
const mobileNavContainer = document.getElementById("mobile-nav-container");
const heroSection = document.getElementById("home");
const scrollThreshold = 10;

window.addEventListener("scroll", () => {
  const heroBottom = heroSection.getBoundingClientRect().bottom;
  if (window.scrollY > scrollThreshold || heroBottom < 0) {
    desktopNavContainer.classList.add("scrolled");
    mobileNavContainer.classList.add("scrolled");
  } else {
    desktopNavContainer.classList.remove("scrolled");
    mobileNavContainer.classList.remove("scrolled");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const heroSection = document.getElementById("home");
  const desktopNavContainer = document.getElementById("desktop-nav-container");
  const mobileNavContainer = document.getElementById("mobile-nav-container");
  const scrollThreshold = 10;

  const heroBottom = heroSection.getBoundingClientRect().bottom;
  if (window.scrollY > scrollThreshold || heroBottom < 0) {
    desktopNavContainer.classList.add("scrolled");
    mobileNavContainer.classList.add("scrolled");
  }
});

// Mobile menu toggle
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

// Close mobile menu when clicking on a link
const mobileLinks = document.querySelectorAll("#mobile-menu a");
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
});

//Directs to checkout page on plans buttons click
document.addEventListener("DOMContentLoaded", () => {
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
});

/*-----------------------------------*/
/*    4. APPLICATION ENTRY POINT     */
/*-----------------------------------*/

// Application entry point
document.addEventListener("DOMContentLoaded", () => App.init());

// Render lucide icons for any dynamic markup after init
document.addEventListener("DOMContentLoaded", () => {
  try {
    if (window.lucide && typeof lucide.createIcons === "function") {
      lucide.createIcons();
    }
  } catch (err) {}
});