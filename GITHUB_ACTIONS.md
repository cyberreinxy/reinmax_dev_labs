# 🚀 GitHub Actions CI Guide

This guide provides a step-by-step overview of the Continuous Integration (CI) pipeline for the Reinmax Dev Labs project, powered by GitHub Actions.

## 🎯 What is GitHub Actions?

GitHub Actions is an automation tool that allows you to run custom workflows directly in your GitHub repository. For this project, we use it as our CI system. Its primary job is to automatically build and test the code every time a change is pushed, ensuring that new code doesn't break existing functionality.

---

## ⚙️ Our Workflow: "Node.js CI"

The workflow is defined in the file `.github/workflow/node.js.yml`. Here’s a breakdown of what it does:

- **Name**: The workflow is named "Node.js CI", which is what you'll see in the "Actions" tab on GitHub.
- **Triggers (`on`)**: The workflow automatically runs on two events:
  - `push`: Every time code is pushed to the `main` branch.
  - `pull_request`: Every time a pull request is opened or updated for the `main` branch.
- **Jobs**: It contains a single job named `build`.
  - **`runs-on: ubuntu-latest`**: The job runs on a fresh virtual machine powered by the latest version of Ubuntu Linux.
  - **`strategy: matrix`**: This powerful feature runs the same job across multiple versions of Node.js (`18.x`, `20.x`, and `22.x`) simultaneously. This ensures the code is compatible with different environments.
  - **`env`**: This section securely injects the `GEMINI_API_KEYS` from your repository's secrets into the job's environment, making it available for the tests.

### Workflow Steps

The `steps` are the heart of the workflow, executed in order:

1.  **`uses: actions/checkout@v4`**: This step checks out your repository's code so the workflow can access it.
2.  **`name: Use Node.js ${{ matrix.node-version }}`**: This step sets up the specific version of Node.js defined in the matrix.
3.  **`name: Install dependencies`**: Runs `npm ci`, which performs a clean and fast installation of all project dependencies based on the `package-lock.json` file. This ensures the build is reproducible.
4.  **`name: Run linter`**: Runs `npm run lint`, which uses ESLint to check the code for style issues and potential errors.
5.  **`name: Run tests`**: Runs `npm test`, which executes the Jest test suite to verify that all backend functionality, including the API endpoints, works as expected.

If any of these steps fail, the entire workflow run will be marked as "failed", immediately notifying you of a problem.

---

## ✅ Step-by-Step Setup

Your project is already configured, but here is the essential setup step required for the workflow to pass its tests.

### Secure Your API Keys for Testing

The workflow needs your `GEMINI_API_KEYS` to run the test suite. You must **never** write secrets directly into your code. Instead, use GitHub Secrets.

1.  In your GitHub repository, navigate to **Settings**.
2.  In the left sidebar, go to **Secrets and variables** > **Actions**.
3.  Click the **New repository secret** button.
4.  Set the **Name** to exactly `GEMINI_API_KEYS`.
5.  In the **Secret** box, paste your comma-separated Gemini API keys (e.g., `key_abc,key_xyz`).
6.  Click **Add secret**.

Once this is done, your GitHub Actions workflow will have everything it needs to run successfully.

---

## 📊 How to View Workflow Runs

You can monitor the status of your CI pipeline at any time.

1.  Go to your project's main page on GitHub.
2.  Click on the **Actions** tab located at the top of the repository.
3.  Here you will see a list of all the workflow runs. Each run will have a status icon:
    - 🟢 **Green checkmark**: The workflow completed successfully.
    - 🔴 **Red X**: One or more steps failed.
    - 🟡 **Yellow circle**: The workflow is currently in progress.
4.  Click on any workflow run to see a detailed view of the `build` job and the logs for each step. This is the best place to look if you need to diagnose a failure.
