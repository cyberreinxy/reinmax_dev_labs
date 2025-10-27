<a name="top"></a>

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/assets/svg/logo/white.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/assets/svg/logo/black.svg">
    <img src="public/assets/svg/logo/black.svg" alt="Reinmax Creative Logo" width="80">
  </picture>
  
  <br>

# Reinmax Creative and Design Agency Website

  <p><em>by Reinmax Dev Labs</em></p>
  
  <p>The official source code for the Reinmax Creative and Design Agency. This repository contains a modern, performant web application with a Node.js backend, featuring "Bitto", a resilient Gemini-powered AI assistant.</p>

  <!-- Badges -->
  <p>
    <!-- Live Site -->
    <a href="https://reinmax-dev-labs.vercel.app/" target="_blank" rel="noopener noreferrer">
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

<details>
  <summary><strong>📚 Table of Contents</strong></summary>
  <ol>
    <li><a href="#1--about-the-project">About The Project</a></li>
    <li><a href="#2--key-features--architectural-highlights">Key Features</a></li>
    <li><a href="#3--tech-stack">Tech Stack</a></li>
    <li><a href="#4--getting-started">Getting Started</a></li>
    <li><a href="#5--project-structure">Project Structure</a></li>
    <li><a href="#6--deployment">Deployment</a></li>
    <li><a href="#7--contributing">Contributing</a></li>
    <li><a href="#8-️-license">License</a></li>
    <li><a href="#9--contact">Contact</a></li>
  </ol>
</details>

---

## 1. 🚀 About The Project

This repository contains the official source code for the **Reinmax Creative and Design Agency**. It serves as our digital headquarters, a portfolio of our work, and a testament to our design philosophy and technical skill.

The project is a classic static-frontend-with-backend-API architecture, built with vanilla JavaScript, HTML, and CSS, and powered by a robust Node.js/Express server. Its primary goal is to showcase our services and provide an interactive, AI-driven point of contact for potential clients.

---

## 2. ✨ Key Features & Architectural Highlights

This project is more than just a static site. It incorporates several key engineering concepts to ensure it is secure, reliable, and maintainable.

### Backend & API (`server.js`)

- **Resilient AI Integration**: The core feature is **Bitto**, an AI assistant powered by the Google Gemini API. The backend includes a sophisticated **server-side API key rotation system**. If one API key fails (due to rate limits, expiration, etc.), the server automatically retries the request with the next available key, ensuring high availability.
- **Security First**: The Express server is hardened with standard security middleware, including `helmet` to set secure HTTP headers, `express-rate-limit` to prevent abuse of the AI endpoint, and `compression` to optimize response sizes.
- **Graceful Shutdown**: The server is configured to handle `SIGINT` and `SIGTERM` signals, ensuring it can shut down gracefully, close connections, and perform cleanup tasks before exiting.
- **Production-Ready Scripts**: The `package.json` distinguishes between `dev` (using `nodemon` for hot-reloading) and `start` (using `node` for production stability).

### Frontend & AI Logic (`public/`)

- **Dual-Mode AI Assistant**: The Bitto assistant operates in two modes. It first attempts to get intelligent responses from the Gemini API. If the API call fails for any reason, it seamlessly falls back to a comprehensive **local knowledge base** (`knowledge-base.js`).
- **Local Knowledge Base**: This fallback system is not just a simple FAQ. It uses a keyword-based relevance scoring algorithm (`calculateRelevanceScore`) to parse user input and provide the most accurate possible answer from its pre-programmed data, ensuring the assistant remains helpful even when disconnected from the API.
- **Modern UI/UX**: The frontend is built with a mobile-first approach, featuring custom preloaders, smooth transitions, and dynamic elements to create a polished, professional user experience.

### Quality, Testing & Automation

- **Automated CI Pipeline**: The project uses GitHub Actions to enforce quality. On every push to `main`, the pipeline automatically runs linting checks and the full test suite. See the **GitHub Actions Guide** for a detailed explanation.
- **Comprehensive Testing**: The backend is tested using **Jest** and **Supertest**. The test suite (`server.test.js`) covers API endpoint integration tests, including error handling and successful responses. The `fetch` call to the Gemini API is mocked to ensure tests are fast and reliable.
- **Code Consistency**: **ESLint** (`.eslintrc.json`) is configured to maintain a consistent code style across the entire project, reducing errors and improving readability.

---

## 3. 🛠️ Tech Stack

This project combines a fast, modern frontend with a powerful and secure Node.js backend.

| Category     | Technology                           | Purpose                                                                        |
| :----------- | :----------------------------------- | :----------------------------------------------------------------------------- |
| **Frontend** | `HTML5`, `CSS3`, `JavaScript (ES6+)` | Core web technologies for structure, styling, and client-side interactivity.   |
| **Backend**  | `Node.js`, `Express.js`              | A robust and minimal framework for building the server and API endpoints.      |
| **AI**       | `Google Gemini API`                  | Powers the "Bitto" AI assistant for intelligent, human-like conversation.      |
| **Testing**  | `Jest`, `Supertest`                  | For robust unit and integration testing of the backend API.                    |
| **DevOps**   | `GitHub Actions`, `Vercel`           | For automating the CI/CD pipeline (testing, linting, and deployment).          |
| **Tooling**  | `ESLint`, `Nodemon`, `Dotenv`        | For code quality, auto-reloading in development, and environment management.   |
| **Security** | `Helmet`, `express-rate-limit`       | To secure the Express application by setting headers and preventing API abuse. |

---

## 4. 🏁 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

- **Node.js**: `v18.x` or later is recommended.
- **npm**: `v8.x` or later.

### Local Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/cyberreinxy/reinmax_dev_labs.git
    cd reinmax_dev_labs
    ```

2.  **Install dependencies:**
    This command installs all dependencies required for the project to run.

    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file by copying the example file. This file will hold your secret API keys.

    ```sh
    cp .env.example .env
    ```

    Open the new `.env` file and add your Google Gemini API keys. You can add multiple keys (separated by commas) to enable the server's key rotation feature.

    > **Note:** This project follows the Conventional Commits specification for commit messages. Please adhere to this standard when contributing.

    > **Important for Vercel Deployment:** The `.env` file is for local development only and should be listed in your `.gitignore`. For deployment, you must set the `GEMINI_API_KEYS` environment variable directly in your Vercel project settings.

    For more detailed contribution guidelines, please see `CONTRIBUTING.md`.

    ```env
    # .env
    GEMINI_API_KEYS="YOUR_GEMINI_API_KEY_1,YOUR_GEMINI_API_KEY_2"
    ```

4.  **Run the development server:**
    This command uses `nodemon` to start the server, which will automatically restart on any file changes.
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Available Scripts

- `npm run dev`: Starts the server in development mode with `nodemon`.
- `npm run start`: Starts the server in production mode with `node`.
- `npm test`: Runs the Jest test suite.
- `npm run lint`: Lints all JavaScript files with ESLint.

---

## 5. 📁 Project Structure

The repository is structured to separate concerns, making it easy to navigate and maintain.

```plaintext
reinmax_dev_labs/
├── .github/
│   └── workflows/
│       └── node.js.yml           # GitHub Actions workflow for Continuous Integration (CI).
├── public/                      # All client-facing files served by Express.
│   ├── assets/                  # Static assets (images, SVGs, etc.).
│   ├── scripts/                 # Frontend JavaScript logic.
│   │   └── bitto/               # Logic for the "Bitto" AI Assistant.
│   │       ├── api-endpoint.js   # Handles communication with the backend server.
│   │       ├── knowledge-base.js # Local fallback data and response logic for Bitto.
│   │       └── visual-design.js  # UI manipulation and state management for Bitto.
│   └── styles/                  # CSS files for styling.
├── .env.example                 # Template for environment variables.
├── .eslintrc.json               # Configuration for ESLint to enforce code style.
├── .gitignore                   # Specifies files for Git to ignore.
├── CODE_OF_CONDUCT.md           # Community guidelines for a positive and inclusive environment.
├── CONTRIBUTING.md              # Guidelines for contributing to the project.
├── jest.config.js               # Configuration for the Jest testing framework.
├── LICENSE.md                   # The MIT License file for the project.
├── package-lock.json            # Records exact versions of dependencies.
├── package.json                 # Project dependencies, scripts, and metadata.
├── server.js                    # The core Express backend server, handles routes & API logic.
├── server.test.js               # Jest & Supertest integration tests for the API endpoints.
├── vercel.md                    # Detailed deployment instructions for the Vercel platform.
└── vercel.json                  # Vercel configuration for builds, routing, and static assets.
```

---

## 6. 🚀 Deployment

This project is configured for seamless, automated deployment on **Vercel**. A detailed, step-by-step guide can be found in `Vercel.md`.

### The CI/CD Pipeline

1.  **Push to `main`**: A developer pushes code to the `main` branch.
2.  **GitHub Actions (CI)**: The push triggers the "Node.js CI" workflow.
    - It installs dependencies using `npm ci`.
    - It runs the linter (`npm run lint`).
    - It runs the test suite (`npm test`).
    - If any step fails, the pipeline stops and reports an error.
3.  **Vercel (CD)**: Vercel is connected to the GitHub repository and automatically triggers a new deployment on every push to `main`.
    - It uses the `vercel.json` file to understand how to build the project.
    - It injects the production `GEMINI_API_KEYS` from its own environment variables.
    - Once the build is successful, the new version is deployed to the live URL.

For a more robust setup, Vercel can be configured to **wait for GitHub Actions checks to pass** before starting a deployment. This is highly recommended and is detailed in the `Vercel.md` guide.

---

## 7. 🤝 Contributing

Contributions are welcome! For detailed instructions on how to get started, please review our Contributing Guidelines. If you have a suggestion or find a bug, please follow these steps:

1.  **Fork** the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

---

## 8. ⚖️ License

This project uses a dual-license model to encourage open-source collaboration while protecting our brand identity.

- **Source Code**: The code in this repository is licensed under the **MIT License**. You are free to use, modify, and distribute the code as a template for your own projects. See the `LICENSE` file for full details.

- **Brand Assets**: All brand assets, including logos, images, and other media found in the `public/assets/` directory, are **All Rights Reserved**. They are the exclusive property of Reinmax Creative and are not covered by the MIT license. They may not be used or reproduced without explicit written permission.

Please see the `LICENSE.md` file for more detailed information.

---

## 9. <a name="9--contact"></a>📧 Contact

Let's connect and build something incredible!

- **Reinhard Baraka**
- **Email**: `reinhardbaraka@gmail.com` | `mail@reinmaxcreative.com`
- **WhatsApp**: <a href="https://wa.me/message/O3LM6XGRY6O5L1">Message on WhatsApp</a>
- **Project Link**: https://github.com/cyberreinxy/reinmax-dev-labs

---

<br><br>

<p align="center"><a href="#top">Back to Top</a></p>
