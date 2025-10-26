# 🚀 Deployment Guide: Reinmax Dev Labs on Vercel

This guide provides a comprehensive, step-by-step walkthrough for deploying the Reinmax Dev Labs project to Vercel. By following these steps, you will set up a seamless Continuous Integration and Continuous Deployment (CI/CD) pipeline.

## 🎯 The Goal

Our objective is to create a fully automated workflow where:

1.  You push code changes to your GitHub repository.
2.  GitHub Actions automatically runs tests and linting to ensure code quality.
3.  If the checks pass, Vercel automatically builds and deploys the new version of your application to a live URL.

This process ensures that your production environment is always stable and up-to-date.

## ✅ Prerequisites

Before you begin, make sure you have the following:

- A GitHub account with the `reinmax-dev-labs` repository pushed.
- A Vercel account (you can sign up for free with your GitHub account).
- Your Google Gemini API keys.

---

## 🚀 Step-by-Step Deployment

### Step 1: Configure Your Project for Vercel

Vercel needs to know how to build and run your Node.js/Express server. We do this by creating a `vercel.json` configuration file in the root of your project.

This file tells Vercel two key things:

1.  **Builds**: Use the `@vercel/node` builder to turn your `server.js` file into a serverless function.
2.  **Routes**: Redirect all incoming traffic (`/(.*)`) to this serverless function.

If you haven't already, create a file named `vercel.json` with the following content:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"
    },
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    { "src": "/(.*)", "dest": "public/$1" }
  ]
}
```

### Step 2: Secure Your API Keys for Testing (GitHub Secrets)

Your GitHub Actions workflow needs access to the `GEMINI_API_KEYS` to run tests successfully. You should **never** commit your `.env` file. Instead, we use GitHub Secrets.

1.  In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
2.  Click **New repository secret**.
3.  Set the **Name** to `GEMINI_API_KEYS`.
4.  In the **Secret** box, paste your comma-separated Gemini API keys (e.g., `key_abc,key_xyz`).
5.  Click **Add secret**.

Your `node.js.yml` workflow is already configured to use this secret.

### Step 3: Deploy to Vercel

Now it's time to connect your project to Vercel and go live.

1.  **Log in to Vercel** and go to your dashboard.
2.  Click **Add New...** > **Project**.
3.  **Import your Git Repository**: Find and select your `reinmax-dev-labs` repository and click **Import**.
4.  **Configure Project**: Vercel will automatically detect your project as a Node.js application using the `vercel.json` file. You don't need to change any build settings.
5.  **Add Environment Variables**: This is the most important step for your live application.

    - In the project configuration screen, find and expand the **Environment Variables** section.
    - Add a new variable:
      - **Name**: `GEMINI_API_KEYS`
      - **Value**: Paste your comma-separated Gemini API keys (e.g., `key_abc,key_xyz`).
    - Click **Add** and ensure the variable is saved before deploying.

6.  Click **Deploy**.

Vercel will now build your project and deploy it. Once complete, you'll be given a live URL for your application!

### Step 4: Commit and Push All Changes

Make sure all the new configuration files (`vercel.json`, `Vercel.md`, `.github/workflows/node.js.yml`, etc.) are committed to your repository.

```sh
git add .
git commit -m "docs: Add deployment guide and final configurations"
git push origin main
```

---

## 💡 Tips and Best Practices

#### What's the difference between GitHub Secrets and Vercel Environment Variables?

- **GitHub Secrets** are used _only_ during the CI/CD process on GitHub's servers (e.g., for running tests). They are not available to your live application.
- **Vercel Environment Variables** are injected into your application at runtime. These are the secrets your live, deployed application will use.

#### My Build is Failing on Vercel!

If a deployment fails, go to your project's dashboard on Vercel and click on the **Deployments** tab. Find the failed deployment and click on it to view the **Logs**. The logs will almost always tell you exactly what went wrong (e.g., a missing dependency, a syntax error, or a failed command).

#### Automatic Deployments

Congratulations! Your CI/CD pipeline is now complete. From now on, every time you push a commit to the `main` branch, Vercel will automatically trigger a new deployment with your latest changes, but only after the tests in your GitHub Actions workflow have passed.

#### How Do GitHub Actions and Vercel Work Together?

It's important to understand the roles of each service:

- **GitHub Actions**: Acts as your primary **quality gate**. The workflow you configured (`node.js.yml`) runs tests and linting on every push. If these checks fail, you are immediately notified that the code quality has dropped, _before_ it gets deployed.
- **Vercel**: Acts as your **deployment and hosting platform**. By default, Vercel starts its own deployment process as soon as you push to the `main` branch.

For a more advanced setup, you can configure Vercel to wait for your GitHub Actions checks to pass before starting a deployment, creating a truly sequential CI/CD pipeline. This can be configured in your Vercel project settings under **Git > Ignored Build Step**.
