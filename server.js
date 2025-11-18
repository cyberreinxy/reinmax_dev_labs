"use strict";

// 1. Import required packages
const express = require("express");
const compression = require("compression"); // Import compression
const helmet = require("helmet"); // Import helmet
const rateLimit = require("express-rate-limit"); // Import express-rate-limit
const path = require("path");
const blogPosts = require("./data/blog-posts.json"); // Load blog data at startup

const app = express();
app.enable("trust proxy"); // Enable trust proxy for secure connections
const port = 3000;

// 3. Add middleware to parse JSON and serve static files
const isProduction = process.env.NODE_ENV === "production";

app.use(
  helmet({
    contentSecurityPolicy: !isProduction ? false : undefined,
    crossOriginEmbedderPolicy: !isProduction ? false : undefined,
    crossOriginOpenerPolicy: !isProduction ? false : undefined,
    hsts: isProduction, // Disable HSTS in development
  })
); // Use Helmet for security headers
app.use(express.json()); // IMPORTANT: This is needed to read data from the frontend

// Force HTTPS in production
app.use((req, res, next) => {
  if (!isProduction || req.secure) {
    return next();
  }
  return res.redirect(301, "https://" + req.headers.host + req.url);
});

app.use(compression()); // Enable Gzip compression for all responses

// Set proper MIME types for JavaScript modules
app.use((req, res, next) => {
  if (req.path.endsWith(".js")) {
    res.type("application/javascript");
  }
  next();
});

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

// Explicit handlers for static file extensions to prevent SPA fallback from catching them
app.get(
  /\.(js|css|json|woff2?|png|jpg|jpeg|gif|svg|webp|ico|map)$/i,
  express.static(path.join(__dirname, "public"))
);

app.get("/status", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes for HTML pages (accessible with or without .html extension)
app.get("/booking", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "booking.html"));
});

app.get("/contacts", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contacts.html"));
});

app.get("/offline", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "offline.html"));
});

app.get("/sitemap", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sitemap.html"));
});

// 5. Create the secure API endpoint
app.post("/api/chat", async (req, res) => {
  // Get the chat history from the frontend request body first
  const { contents, systemInstruction } = req.body;

  // Validate request body before checking API keys
  if (!contents) {
    return res
      .status(400)
      .json({ error: "Missing 'contents' in request body" });
  }

  // 4. Securely load API keys at runtime from environment variables
  const GEMINI_API_KEYS = process.env.GEMINI_API_KEYS
    ? process.env.GEMINI_API_KEYS.split(",")
    : [];
  if (GEMINI_API_KEYS.length === 0) {
    return res
      .status(500)
      .json({ error: "The AI service is not configured on the server." });
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

// API endpoint for all blog posts
app.get("/api/blog", (req, res) => {
  res.json(blogPosts);
});

// API endpoint for a single blog post by slug
app.get("/api/blog/:slug", (req, res) => {
  const slug = req.params.slug;
  const post = blogPosts.find((p) => p.slug === slug);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: "Blog post not found." });
  }
});

// Route for single blog post page
app.get("/blog/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "post.html"));
});

// 404 Fallback: Serve 404.html for any unmatched routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// This block will only run when the script is executed directly (e.g., `node server.js`)
// It will not run when the file is imported by another script (e.g., for testing or Vercel deployment)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[server] Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
