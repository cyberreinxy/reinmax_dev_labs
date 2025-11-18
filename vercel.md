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

This file tells Vercel how to route incoming requests. In this configuration, all incoming traffic (`/(.*)`) is directed to your `server.js` file, which will handle all requests.

If you haven't already, create a file named `vercel.json` with the following content:

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```



### Step 2: Deploy to Vercel

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

### Step 3: Commit and Push All Changes

Make sure all the new configuration files (`vercel.json`, etc.) are committed to your repository.

```sh
git add .
git commit -m "docs: Add deployment guide and final configurations"
git push origin main
```

---

## 💡 A Note on Environment Variables

**Vercel Environment Variables** are injected into your application at runtime. These are the secrets your live, deployed application will use to function correctly. Keep them secure and do not expose them in your client-side code.

#### My Build is Failing on Vercel!

If a deployment fails, go to your project's dashboard on Vercel and click on the **Deployments** tab. Find the failed deployment and click on it to view the **Logs**. The logs will almost always tell you exactly what went wrong (e.g., a missing dependency, a syntax error, or a failed command).

#### Automatic Deployments

Congratulations! Your deployment pipeline is now complete. From now on, every time you push a commit to the `main` branch, Vercel will automatically trigger a new deployment with your latest changes.
