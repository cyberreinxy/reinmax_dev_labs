// 1. Import required packages
const express = require("express");
const dotenv = require("dotenv");
const compression = require("compression"); // Import compression
const helmet = require("helmet"); // Import helmet
const rateLimit = require("express-rate-limit"); // Import express-rate-limit

// 2. Load environment variables from the .env file
dotenv.config();

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
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ], // Allow styles from self, inline, and Google Fonts
        "font-src": ["'self'", "https://fonts.gstatic.com"], // Allow fonts from self and Google Fonts
        "img-src": ["'self'", "data:"], // Allow images from self and data URIs
      },
    },
  })
); // Use Helmet for security headers
app.use(express.json()); // IMPORTANT: This is needed to read data from the frontend
app.use(compression()); // Enable Gzip compression for all responses
app.use(express.static("public"));

// Configure rate limiting for the API endpoint
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api/chat", apiLimiter); // Apply rate limiting to the /api/chat endpoint

// 4. Securely load API keys from the .env file
const GEMINI_API_KEYS = process.env.GEMINI_API_KEYS
  ? process.env.GEMINI_API_KEYS.split(",")
  : [];

if (GEMINI_API_KEYS.length === 0) {
  console.error(
    "FATAL ERROR: GEMINI_API_KEYS not found in .env file. Please create a .env file and add your keys."
  );
  process.exit(1); // Stop the server if keys are missing
}

let currentApiKeyIndex = 0;

// 5. Create the secure API endpoint
app.post("/api/chat", async (req, res) => {
  // Get the chat history from the frontend request body
  const { contents, systemInstruction } = req.body;

  if (!contents) {
    return res
      .status(400)
      .json({ error: "Missing 'contents' in request body" });
  }

  const payload = { contents, systemInstruction };
  let lastError = null;

  // Server-side key rotation logic
  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    const keyIndexToTry = currentApiKeyIndex;
    const apiKey = GEMINI_API_KEYS[currentApiKeyIndex];
    currentApiKeyIndex = (currentApiKeyIndex + 1) % GEMINI_API_KEYS.length;

    try {
      console.log(`Attempting API call with Key index ${keyIndexToTry}`);

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
      console.log("API call successful. Sending response to client.");
      return res.json(data); // Success! Send the data back to the frontend
    } catch (error) {
      console.error(`API Key at index ${keyIndexToTry} failed:`, error.message);
      lastError = error;
    }
  }

  // If all keys failed, send a final error response
  console.error("All API keys failed to get a response.");
  res.status(500).json({
    error: "The AI service is currently unavailable. All API keys failed.",
  });
});

let server;
// Start the server only if not in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  server = app.listen(port, () => {
    console.log(`Reinmax Dev Labs is running at http://localhost:${port}`);
  });
}

// For Vercel, export the app as the default.
// For local development and testing, export both app and server.
module.exports = process.env.VERCEL ? app : { app, server };
