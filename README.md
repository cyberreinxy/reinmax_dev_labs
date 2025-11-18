# Reinmax Creative and Design Agency Website

<div align="center">
  <img src="public/assets/svg/logo/logo-theme.svg" alt="Reinmax Creative Logo" width="80">
  
  <br>
  <p><em>by Reinmax Dev Labs</em></p>
  
  <p>The official source code for the Reinmax Creative and Design Agency. This repository contains a modern, performant web application with a Node.js backend, featuring "Bitto", a resilient Gemini-powered AI assistant.</p>

  <!-- Badges -->
  <p>
    <!-- Live Site -->
    <a href="https://reinmax.vercel.app/" target="_blank" rel="noopener noreferrer">
      <img alt="Live Site" src="https://img.shields.io/badge/vercel-visit%20site-003333?style=for-the-badge&logo=vercel&logoColor=white">
    </a>
    <!-- Repo Size -->
    <a href="https://github.com/cyberreinxy/reinmax_dev_labs">
      <img alt="Repo Size" src="https://img.shields.io/github/repo-size/cyberreinxy/reinmax_dev_labs?style=for-the-badge&logo=github&color=003333&logoColor=white">
    </a>
    <!-- Repo Activity -->
    <a href="https://github.com/cyberreinxy/reinmax_dev_labs/graphs/commit-activity">
      <img alt="Last Commit" src="https://img.shields.io/github/last-commit/cyberreinxy/reinmax_dev_labs?style=for-the-badge&logo=github&color=003333&logoColor=white">
    </a>
  </p>
</div>

---

## 📚 Table of Contents

1. [About The Project](#about-the-project)
2. [Key Features](#key-features--architectural-highlights)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Key Improvements & Fixes](#key-improvements--fixes)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)
10. [Contact](#contact)

---

## About The Project

This repository contains the official source code for the **Reinmax Creative and Design Agency**. It serves as our digital headquarters, a portfolio of our work, and a testament to our design philosophy and technical skill.

The project is a classic static-frontend-with-backend-API architecture, built with vanilla JavaScript, HTML, and CSS, and powered by a robust Node.js/Express server. Its primary goal is to showcase our services and provide an interactive, AI-driven point of contact for potential clients.

---

## Key Features & Architectural Highlights

### Backend & API (`server.js`)

- **Resilient AI Integration**: The core feature is **Bitto**, an AI assistant powered by the Google Gemini API. The backend includes a sophisticated **server-side API key rotation system**. If one API key fails (due to rate limits, expiration, etc.), the server automatically retries the request with the next available key, ensuring high availability.
- **Security First**: The Express server is hardened with standard security middleware:
  - `helmet` for secure HTTP headers and Content Security Policy (CSP)
  - `express-rate-limit` to prevent abuse of the AI endpoint
  - `compression` to optimize response sizes with Gzip
  - Proper MIME type handling to prevent content-type mismatches
- **Smart Static File Serving**: Explicit route handlers ensure static files (CSS, JS, images, fonts) are served with correct MIME types and bypass the SPA fallback middleware.
- **Single Page Application (SPA) Routing**: The server intelligently routes unmapped URLs to `index.html` for client-side routing, while preserving static asset delivery.
- **Graceful Shutdown**: The server is configured to handle `SIGINT` and `SIGTERM` signals, ensuring it can shut down gracefully, close connections, and perform cleanup tasks before exiting.

### Frontend & AI Logic (`public/`)

- **Dual-Mode AI Assistant**: The Bitto assistant operates in two modes. It first attempts to get intelligent responses from the Gemini API. If the API call fails for any reason, it seamlessly falls back to a comprehensive **local knowledge base**.
- **Local Knowledge Base**: This fallback system is not just a simple FAQ. It uses a keyword-based relevance scoring algorithm to parse user input and provide the most accurate possible answer from its pre-programmed data.
- **Progressive Web App (PWA)**: Features a Service Worker for offline functionality and asset caching, with intelligent cache versioning for updates.
- **Modern UI/UX**: The frontend is built with a mobile-first approach, featuring custom preloaders, smooth transitions, and dynamic elements.

### Quality, Testing & Automation

- **Comprehensive Testing**: The backend is tested using **Jest** and **Supertest**. The test suite covers API endpoint integration tests, including error handling and successful responses.
- **Code Consistency**: **ESLint** is configured to maintain a consistent code style across the entire project.
- **Zero Manual Deployment**: Simply push to GitHub—Vercel automatically handles testing, building, and deployment.

---

## Tech Stack

| Category        | Technology                           | Purpose                                                                        |
| :-------------- | :----------------------------------- | :----------------------------------------------------------------------------- |
| **Frontend**    | `HTML5`, `CSS3`, `JavaScript (ES6+)` | Core web technologies for structure, styling, and client-side interactivity.   |
| **Styling**     | `Tailwind CSS`, `PostCSS`            | Utility-first CSS framework for rapid design development.                      |
| **Backend**     | `Node.js 20.x+`, `Express.js 5.1.0`  | Robust framework for building the server and API endpoints.                    |
| **AI**          | `Google Gemini 2.5 Pro API`          | Powers the "Bitto" AI assistant for intelligent, human-like conversation.      |
| **Testing**     | `Jest 30.x`, `Supertest 7.x`         | For robust unit and integration testing of the backend API.                    |
| **DevOps**      | `Vercel`, `GitHub`                   | For automated deployment and version control.                                  |
| **Tooling**     | `ESLint`, `Nodemon`, `Dotenv`        | For code quality, auto-reloading in development, and environment management.   |
| **Security**    | `Helmet.js`, `express-rate-limit`    | To secure the Express application by setting headers and preventing API abuse. |
| **Compression** | `compression` (Gzip)                 | To optimize response sizes for faster page loads.                              |
| **PWA**         | `Service Worker API`                 | For offline functionality and intelligent asset caching with version control.  |

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or later
- **npm**: `v10.x` or later

### Local Setup

1. **Clone the repository:**

```sh
git clone https://github.com/cyberreinxy/reinmax_dev_labs.git
cd reinmax_dev_labs
```

2. **Install dependencies:**

```sh
npm install
```

3. **Set up environment variables:**

```sh
cp .env.example .env
```

Add your Google Gemini API keys to `.env`:

```env
GEMINI_API_KEYS="YOUR_GEMINI_API_KEY_1,YOUR_GEMINI_API_KEY_2"
```

4. **Run the development server:**

```sh
npm run dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `npm run dev`: Starts the server in development mode with `nodemon`
- `npm start`: Starts the server in production mode with `node`
- `npm test`: Runs the Jest test suite with mocked API calls
- `npm run lint`: Lints all JavaScript files with ESLint
- `npm run watch:css`: Watches for CSS changes and rebuilds with PostCSS
- `npm run build:css`: Builds the CSS files with Tailwind and PostCSS

---

## Project Structure

```plaintext
reinmax_dev_labs/
├── public/                           # All client-facing files served by Express
│   ├── assets/                       # Static assets (images, fonts, icons, etc.)
│   │   ├── fonts/                    # Font files
│   │   │   ├── Bricolage-Grotesque/  # Multiple font weights and variants
│   │   │   └── Space-Grotesk/        # Multiple font weights and variants
│   │   ├── gif/                      # Animated GIF files
│   │   ├── ico/                      # Favicon and icon files
│   │   ├── people/                   # Team member photos
│   │   ├── png/                      # PNG format images
│   │   ├── svg/                      # SVG graphics and logos
│   │   │   └── logo/                 # Logo variants
│   │   └── webp/                     # Modern WebP format images
│   │       └── accordion/             # Images for accordion components
│   ├── scripts/                      # Frontend JavaScript logic
│   │   ├── bitto/                    # AI Assistant logic
│   │   │   ├── api-endpoint.js       # Backend communication
│   │   │   ├── knowledge-base.js     # Local fallback data
│   │   │   └── visual-design.js      # UI state management
│   │   ├── booking.js                # Booking page functionality
│   │   ├── script.js                 # Main application logic
│   │   └── register-sw.js            # Service Worker registration
│   ├── styles/                       # CSS files
│   │   ├── bitto.css                 # Bitto AI assistant styles
│   │   ├── booking.css               # Booking page styles
│   │   ├── input.css                 # Custom input styling
│   │   ├── main.css                  # Main stylesheet
│   │   └── tailwind.css              # Tailwind CSS compiled output
│   ├── 404.html                      # Error page
│   ├── academy.html                  # Academy/courses page
│   ├── booking.html                  # Booking/consultation page
│   ├── contacts.html                 # Contact form page
│   ├── index.html                    # Main homepage
│   ├── offline.html                  # Offline fallback page
│   ├── service-worker.js             # Service Worker for PWA
│   └── sitemap.html                  # Sitemap page
├── .eslintrc.json                    # ESLint configuration
├── .gitignore                        # Git ignore rules
├── CODE_OF_CONDUCT.md                # Community guidelines
├── CONTRIBUTING.md                   # Contribution guidelines
├── eslint.config.js                  # ESLint config (alternative)
├── jest.config.js                    # Jest configuration
├── LICENSE.md                        # MIT License
├── package.json                      # Dependencies and scripts
├── package-lock.json                 # Dependency lock file
├── postcss.config.js                 # PostCSS configuration
├── README.md                         # This file
├── server.js                         # Express backend server
├── server.test.js                    # Integration tests
├── tailwind.config.js                # Tailwind CSS config
├── vercel.json                       # Vercel deployment config
└── vercel.md                         # Vercel deployment guide
```

---

## Key Improvements & Fixes

### Recent Updates (November 2025)

#### **MIME Type & Asset Loading Issues**

- **Problem**: CSS, JavaScript, and image files were being served with `text/html` MIME type
- **Solution**: Added explicit route handlers for static files to prevent SPA fallback middleware from intercepting assets
- **Impact**: All static resources now load with correct MIME types

#### **Service Worker Cache Issues**

- **Problem**: Old cached versions causing `NS_ERROR_CORRUPTED_CONTENT` errors
- **Solutions**:
  - Fixed inconsistent asset paths in Service Worker
  - Removed non-existent asset references from pre-cache list
  - Improved error handling in fetch event listener
  - Renamed Service Worker from `sw.js` to `service-worker.js`
  - Bumped cache version from `v1` to `v2`
- **Impact**: Fresh cache on every deployment, zero corrupted content errors

#### **Missing Pages & Routes**

- **Problem**: `academy.html` referenced but didn't exist, broken sitemap links
- **Solutions**:
  - Created `academy.html` with proper structure
  - Fixed sitemap to only link to existing pages
  - Updated paths to absolute references
- **Impact**: All navigation links work correctly

#### **Vercel Configuration**

- **Problem**: Warning about unused build settings
- **Solution**: Removed explicit `builds` section to use Vercel auto-detection
- **Impact**: Cleaner configuration, automatic Node.js version selection

#### **Build & Deployment**

- Removed GitHub Actions (tests run locally only)
- Cleaned repository (removed coverage folder)
- Updated dependencies (supertest)

---

## Deployment

This project is configured for seamless deployment on **Vercel**.

### The Deployment Flow

1. **Push to GitHub**: Code is pushed to the `main` branch
2. **Vercel Webhook**: Vercel automatically triggers a new deployment
3. **Build Phase**: Node.js environment is auto-detected and project is built
4. **Deployment**: Version is deployed to the live URL in seconds

### Environment Variables

For production, set in Vercel project settings:

```env
GEMINI_API_KEYS=your_key_1,your_key_2,your_key_3
```

### Live Site

- **Production**: https://reinmax.vercel.app/

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

See `CONTRIBUTING.md` for detailed guidelines.

---

## License

This project uses a dual-license model:

- **Source Code**: MIT License (see `LICENSE.md`)
- **Brand Assets**: All Rights Reserved (logos, images in `public/assets/`)

---

## Contact

Let's connect and build something incredible!

- **Reinhard Baraka**
- **Email**: `reinhardbaraka@gmail.com` | `mail@reinmaxcreative.com`
- **WhatsApp**: [Message on WhatsApp](https://wa.me/message/O3LM6XGRY6O5L1)
- **Project Link**: https://github.com/cyberreinxy/reinmax_dev_labs

---

<p align="center"><a href="#table-of-contents">Back to Top</a></p>
