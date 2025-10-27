// Main application controller. Handles UI, state, and orchestrates other modules.

import { getLocalResponse } from "./knowledge-base.js";
import { getAIResponseFromServer } from "./api-endpoint.js";

const elements = {
  wrapper: document.getElementById("bitto-popup-wrapper"),
  fab: document.getElementById("bitto-chat-fab"),
  backToTopBtn: document.getElementById("back-to-top-btn"), // Button to scroll to the top of the page
  closeBtn: document.getElementById("bitto-close-btn"),
  overlay: document.querySelector(".bitto-popup-overlay"),
  chat: {
    form: document.getElementById("bitto-chat-form"),
    input: document.getElementById("bitto-chat-input"),
    sendBtn: document.getElementById("bitto-send-btn"),
    history: document.getElementById("bitto-chat-history"),
    deleteBtn: document.getElementById("bitto-delete-chat-btn"),
    quickActions: document.getElementById("bitto-quick-actions"),
  },
};

// --- Dynamic Help Tip ---

// Create the tip element; CSS handles all styling and animation.
const tipMessage = document.createElement("div");
tipMessage.className = "bitto-tip-message";

// Define tip layout: [Content] [Separator] [Close Button]
tipMessage.innerHTML = `<div class="bitto-tip-content"><strong>Need help?</strong><br>Let Bitto assist you!</div><div class="bitto-tip-separator"></div><button class="bitto-tip-close-btn" aria-label="Close tip"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button>`;

// Inject the tip into the DOM.
document.body.appendChild(tipMessage);

// --- Tip State & Handlers ---

let tipTimeout; // Timer for auto-hiding the tip.

/**
 * Hides tip and clears the auto-hide timer.
 */
function closeTip() {
  tipMessage.classList.remove("show");
  if (tipTimeout) clearTimeout(tipTimeout); // Ensure auto-hide doesn't fire after manual close.
}

// --- Tip Initialization ---

// Show tip after a 1.5s delay.
setTimeout(() => {
  tipMessage.classList.add("show");

  // Set timer to auto-dismiss after 10s.
  tipTimeout = setTimeout(closeTip, 10000);
}, 1500);

let state = {
  cardIsVisible: false,
  fabIsVisible: false,
  chatHistory: [],
  isLoading: false,
  conversationContext: { askedAbout: [], userInterest: null },
  bookingState: {
    isActive: false,
    step: null,
    data: { name: "", email: "", day: "", time: "" },
  },
};

async function getAIResponse() {
  const lastUserMessage =
    state.chatHistory[state.chatHistory.length - 1]?.parts[0]?.text || "";
  let aiResponse = null;
  let tier = null;

  try {
    // Tier 1: Attempt secure server API
    aiResponse = await getAIResponseFromServer(state);
    tier = "Server-Side API (Primary)";
  } catch (error) {
    // Tier 2: Fallback to local model
    console.error("Server API failed, falling back to local model:", error);
    aiResponse = getLocalResponse(lastUserMessage, state);
    tier = "Local Trained Model (Fallback)";
  }

  setTimeout(() => {
    removeTypingIndicator();
    processAIResponse(aiResponse);
    finishLoading();
    elements.chat.input.focus();
  }, 400);
}

function toggleChatInput(enabled) {
  elements.chat.input.disabled = !enabled;
  elements.chat.sendBtn.disabled = !enabled;
}

function addMessageToChat(sender, message, options = {}) {
  const messageEl = document.createElement("div");
  messageEl.classList.add("bitto-chat-message", `bitto-${sender}-message`);
  if (options.isError) messageEl.classList.add("bitto-error-message");

  // Store the original message for chat history
  const originalMessage = message;

  // Format for display (Markdown bold syntax)
  const formattedMessage = message.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );
  messageEl.innerHTML = `<p>${formattedMessage.replace(/\n/g, "<br>")}</p>`;
  elements.chat.history.appendChild(messageEl);
  elements.chat.history.scrollTop = elements.chat.history.scrollHeight;

  if (!options.transient) {
    state.chatHistory.push({
      role: sender === "user" ? "user" : "model",
      parts: [{ text: originalMessage }],
    });
  }
}

function showTypingIndicator() {
  if (document.getElementById("bitto-typing-indicator")) return;
  const indicator = document.createElement("div");
  indicator.id = "bitto-typing-indicator";
  indicator.classList.add(
    "bitto-chat-message",
    "bitto-ai-message",
    "bitto-typing-indicator"
  );
  indicator.innerHTML = `<p><span></span><span></span><span></span></p>`;
  elements.chat.history.appendChild(indicator);
  elements.chat.history.scrollTop = elements.chat.history.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById("bitto-typing-indicator");
  if (indicator) indicator.remove();
}

function startBittoConversation() {
  showTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    addMessageToChat(
      "ai",
      `Hello! I'm Bitto, your assistant at Reinmax Creative. How can I help you today?`
    );
  }, 800);
}

function clearChat() {
  state.chatHistory = [];
  elements.chat.history.innerHTML = "";
  state.conversationContext = { askedAbout: [], userInterest: null };
  state.bookingState = {
    isActive: false,
    step: null,
    data: { name: "", email: "", day: "", time: "" },
  };
  startBittoConversation();
}

function processAIResponse(response) {
  removeTypingIndicator();
  let tool = null;
  let toolData = null;
  try {
    const parsed = JSON.parse(response);
    tool = parsed.tool;
    toolData = parsed;
  } catch (e) {
    // Not a tool, just a text response
  }
  if (tool) {
    executeTool(tool, toolData);
  } else {
    addMessageToChat("ai", response);
    if (state.bookingState.isActive) {
      updateBookingState(response);
    }
  }
  finishLoading();
  elements.chat.input.focus();
}

function updateBookingState(aiMessage) {
  const lowerMsg = aiMessage.toLowerCase();
  if (lowerMsg.includes("name") && !state.bookingState.data.name) {
    state.bookingState.step = "name";
  } else if (lowerMsg.includes("email") && !state.bookingState.data.email) {
    state.bookingState.step = "email";
  } else if (lowerMsg.includes("day") && !state.bookingState.data.day) {
    state.bookingState.step = "day";
  } else if (lowerMsg.includes("time") && !state.bookingState.data.time) {
    state.bookingState.step = "time";
  } else if (lowerMsg.includes("summary") || lowerMsg.includes("confirm")) {
    state.bookingState.step = "summary";
  }
}

function extractBookingInfo(userMessage) {
  const step = state.bookingState.step;
  if (step === "name" && !state.bookingState.data.name) {
    state.bookingState.data.name = userMessage.trim();
    return true;
  } else if (step === "email" && !state.bookingState.data.email) {
    if (userMessage.includes("@")) {
      state.bookingState.data.email = userMessage.trim();
      return true;
    }
  } else if (step === "day" && !state.bookingState.data.day) {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const foundDay = days.find((d) => userMessage.toLowerCase().includes(d));
    if (foundDay) {
      state.bookingState.data.day =
        foundDay.charAt(0).toUpperCase() + foundDay.slice(1);
      return true;
    }
  } else if (step === "time" && !state.bookingState.data.time) {
    if (userMessage.match(/\d{1,2}:\d{2}|[0-9]+\s*(am|pm)/i)) {
      state.bookingState.data.time = userMessage.trim();
      return true;
    }
  }
  return false;
}

function executeTool(toolName, toolData) {
  if (toolName === "booking_complete") {
    const summary = `Thank you **${toolData.name}**! Your call has been scheduled:\n📧 **Email**: ${toolData.email}\n📅 **Day**: ${toolData.day}\n🕐 **Time**: ${toolData.time}\n\nWe'll send a confirmation to your email shortly. Looking forward to speaking with you!`;
    addMessageToChat("ai", summary);
    sendBookingEmail(toolData);
    state.bookingState.isActive = false;
    state.bookingState.step = null;
    state.bookingState.data = { name: "", email: "", day: "", time: "" };
  } else if (toolName === "schedule_call") {
    addMessageToChat(
      "ai",
      "Great! I'd love to help you schedule a call. What's your full name?"
    );
    state.bookingState.isActive = true;
    state.bookingState.step = "name";
  } else if (toolName === "contact_us") {
    addMessageToChat(
      "ai",
      `You can reach us at Reinmax Creative's email or phone. We're here to help!`
    );
  }
}

function sendBookingEmail(bookingData) {
  // This is a simulation. In a real app, this would be an API call.
  console.log("--- Booking Email Simulation ---", {
    to: bookingData.email,
    subject: `New Call Booking - ${bookingData.name}`,
    body: `Name: ${bookingData.name}\nDay: ${bookingData.day}\nTime: ${bookingData.time}`,
  });
}

function handleUserInput(prompt) {
  const userInput = (prompt || elements.chat.input.value).trim();
  if (!userInput || state.isLoading) return;
  addMessageToChat("user", userInput);
  if (!prompt) elements.chat.input.value = "";

  // Booking logic
  if (state.bookingState.isActive && state.bookingState.step) {
    const extracted = extractBookingInfo(userInput);

    if (extracted) {
      const { name, email, day, time } = state.bookingState.data;
      if (name && !email) {
        addMessageToChat(
          "ai",
          `Perfect, ${name}! What's your **email address**?`
        );
        state.bookingState.step = "email";
        return;
      } else if (name && email && !day) {
        addMessageToChat(
          "ai",
          `Great! Which **day** works best for you? (Monday-Friday)`
        );
        state.bookingState.step = "day";
        return;
      } else if (name && email && day && !time) {
        addMessageToChat(
          "ai",
          `Perfect! What **time** would you prefer? (8 AM - 5 PM)`
        );
        state.bookingState.step = "time";
        return;
      } else if (name && email && day && time) {
        addMessageToChat(
          "ai",
          `Let me confirm:\n📧 **Email**: ${email}\n📅 **Day**: ${day}\n🕐 **Time**: ${time}\n\nIs this correct? (Yes/No)`
        );
        state.bookingState.step = "summary";
        return;
      }
    }

    if (state.bookingState.step === "summary") {
      if (
        userInput.toLowerCase().includes("yes") ||
        userInput.toLowerCase().includes("confirm")
      ) {
        executeTool("booking_complete", state.bookingState.data);
        return;
      }
    }
  }

  // Standard AI query
  state.isLoading = true;
  elements.chat.sendBtn.classList.add("is-loading");
  toggleChatInput(false);
  showTypingIndicator();
  getAIResponse();
}

function finishLoading() {
  state.isLoading = false;
  elements.chat.sendBtn.classList.remove("is-loading");
  toggleChatInput(true);
}

function showCard() {
  elements.wrapper.classList.add("is-card-visible");
  elements.wrapper.classList.remove("is-fab-visible");
  elements.backToTopBtn.classList.remove("show"); // Hide back-to-top button
  closeTip(); // Hide the tip message as well
  state.cardIsVisible = true;

  // Clear current chat display and render messages from state.chatHistory
  elements.chat.history.innerHTML = "";
  state.chatHistory.forEach((msg) => {
    addMessageToChat(msg.role === "user" ? "user" : "ai", msg.parts[0].text, {
      transient: true,
    });
  });

  // If chat history is still empty (e.g., first open or after clearChat), display the starter message
  if (state.chatHistory.length === 0) {
    setTimeout(() => startBittoConversation(), 300); // Add a slight delay for better UX
  }
  // Ensure scroll is at the bottom
  elements.chat.history.scrollTop = elements.chat.history.scrollHeight;
}

function showFab() {
  elements.wrapper.classList.remove("is-card-visible");
  elements.wrapper.classList.add("is-fab-visible");
  state.cardIsVisible = false;
  handleScroll(); // Re-evaluate scroll position to show/hide back-to-top button
}

function handleScroll() {
  // Do not show the back-to-top button if the chat card is visible.
  if (state.cardIsVisible) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > 200) {
    // Show button after scrolling 200px
    elements.backToTopBtn.classList.add("show");
    elements.fab.classList.add("is-shifted-up");
    tipMessage.classList.add("is-shifted-up");
  } else {
    elements.backToTopBtn.classList.remove("show");
    elements.fab.classList.remove("is-shifted-up");
    tipMessage.classList.remove("is-shifted-up");
  }
}

// --- Event Listeners ---

elements.fab.addEventListener("click", () => {
  // Toggles the chat card visibility.
  if (state.cardIsVisible) {
    showFab();
  } else {
    showCard();
  }
});

// New listener for the separate back-to-top button
elements.backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

elements.closeBtn.addEventListener("click", showFab);
elements.overlay.addEventListener("click", showFab);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.cardIsVisible) showFab();
});

elements.chat.form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleUserInput();
});

elements.chat.quickActions.addEventListener("click", (e) => {
  if (e.target.dataset.prompt) {
    handleUserInput(e.target.dataset.prompt);
  }
});

elements.chat.deleteBtn.addEventListener("click", clearChat);
window.addEventListener("scroll", handleScroll, { passive: true });

// --- Keyboard Handling ---

function initKeyboardAdjust() {
  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  if (!isTouchDevice()) {
    return;
  }

  const bittoChatInput = document.getElementById("bitto-chat-input");
  const bittoPopupCard = document.querySelector(".bitto-popup-card");

  if (!bittoChatInput || !bittoPopupCard) {
    return;
  }

  const handleFocus = () => {
    // Add a class to the body to indicate keyboard is active
    document.body.classList.add("bitto-keyboard-active");
    // Scroll the chat input into view
    setTimeout(() => {
      bittoPopupCard.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 300);
  };

  const handleBlur = () => {
    document.body.classList.remove("bitto-keyboard-active");
  };

  bittoChatInput.addEventListener("focus", handleFocus);
  bittoChatInput.addEventListener("blur", handleBlur);

  // More reliable keyboard detection using visualViewport
  if (window.visualViewport) {
    let initialViewportHeight = window.visualViewport.height;

    window.visualViewport.addEventListener("resize", () => {
      const newViewportHeight = window.visualViewport.height;
      // If viewport height is significantly smaller, keyboard is likely open
      if (newViewportHeight < initialViewportHeight * 0.9) {
        document.body.classList.add("bitto-keyboard-active");
      } else {
        // Keyboard is likely closed
        document.body.classList.remove("bitto-keyboard-active");
      }
    });
  }
}

// --- Initialization ---

showFab();
handleScroll();
initKeyboardAdjust(); // Initialize keyboard handling

// Bind the close button click event.
tipMessage
  .querySelector(".bitto-tip-close-btn")
  .addEventListener("click", closeTip);

console.log("Bitto Assistant Initialized");
