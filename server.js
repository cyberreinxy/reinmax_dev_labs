"use strict";

// 1. Import required packages
const express = require("express");
const compression = require("compression"); // Import compression
const helmet = require("helmet"); // Import helmet
const rateLimit = require("express-rate-limit"); // Import express-rate-limit
const path = require("path");

const app = express();
const port = 3000;

// 3. Add middleware to parse JSON and serve static files
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
          "https://unpkg.com",
          "https://js.hcaptcha.com",
          "https://cdn.jsdelivr.net",
        ], // Allow scripts from self, inline, and trusted CDNs
        "style-src": ["'self'", "'unsafe-inline'"], // Allow styles from self and inline
        "font-src": ["'self'"], // Allow fonts from self only
        "img-src": ["'self'", "data:"], // Allow images from self and data URIs
        "script-src-attr": ["'unsafe-inline'"], // Allow inline event handlers
      },
    },
  })
); // Use Helmet for security headers
app.use(express.json()); // IMPORTANT: This is needed to read data from the frontend

app.use(compression()); // Enable Gzip compression for all responses

// Serve Fontsource fonts from node_modules
app.use("/fonts", express.static(path.join(__dirname, "public/assets/fonts")));

// Serve static files with custom caching rules
app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      // Disable caching for HTML files
      if (path.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      }
    },
  })
);

// Configure rate limiting for the API endpoint
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per `windowMs`
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api/chat", apiLimiter); // Apply rate limiting to the /api/chat endpoint

app.get("/status", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 5. Create the secure API endpoint
app.post("/api/chat", async (req, res) => {
  // 4. Securely load API keys at runtime from environment variables
  const GEMINI_API_KEYS = process.env.GEMINI_API_KEYS
    ? process.env.GEMINI_API_KEYS.split(",")
    : [];
  if (GEMINI_API_KEYS.length === 0) {
    return res
      .status(500)
      .json({ error: "The AI service is not configured on the server." });
  }

  // Get the chat history from the frontend request body
  const { contents, systemInstruction } = req.body;

  if (!contents) {
    return res
      .status(400)
      .json({ error: "Missing 'contents' in request body" });
  }

  const payload = { contents, systemInstruction };
  let lastError = null;

  // Stateless key rotation: Try a random key first, then iterate through the rest.
  const startIndex = Math.floor(Math.random() * GEMINI_API_KEYS.length);
  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    const apiKey = GEMINI_API_KEYS[(startIndex + i) % GEMINI_API_KEYS.length];
    try {
      const apiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!apiResponse.ok) {
        throw new Error(`API returned status ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      return res.json(data); // Success! Send the data back to the frontend
    } catch (error) {
      lastError = error;
      // Log the specific error for debugging purposes in your Vercel logs.
      // This won't be sent to the client.
      const keyToLog = apiKey.substring(0, 4) + "..."; // Avoid logging the full key
      console.error(
        `[server] API key ${keyToLog} failed. Error: ${error.message}. Retrying...`
      );
    }
  }

  // If all keys failed, send a final error response
  res.status(500).json({
    error: "The AI service is currently unavailable. All API keys failed.",
  });
});

// 6. Handle 404 errors, if no route matches
app.use((req, res, next) => {
  // Log the URL that wasn't found
  console.warn(`[server] 404 - Not Found: ${req.originalUrl}`);

  // If it's an API request, send JSON
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }

  // For regular pages, send the 404 HTML page
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// This block will only run when the script is executed directly (e.g., `node server.js`)
// It will not run when the file is imported by another script (e.g., for testing or Vercel deployment)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`[server] Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
