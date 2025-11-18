# Contributing to Reinmax Dev Labs

First off, thank you for considering contributing to the Reinmax Creative and Design Agency website project! Your help is greatly appreciated. Every contribution, no matter how small, helps make this project better.

This document provides a set of guidelines for contributing. These are mostly guidelines, not strict rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the [Reinmax Dev Labs Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to `dev@reinmaxcreative.com`.

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as GitHub issues. Before opening a new issue, please perform a search to see if the problem has already been reported.

When you are creating a bug report, please include as many details as possible:

- A clear and descriptive title.
- A description of the steps to reproduce the issue.
- The expected behavior vs. the actual behavior.
- Screenshots or screen recordings, if applicable.

### Suggesting Enhancements

Enhancement suggestions are also tracked as GitHub issues.

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Explain why this enhancement would be useful** to most users.

### Pull Requests

We welcome pull requests! Here's how to get started:

1.  **Fork the repository** and create your branch from `main`.
2.  **Set up your local environment** by following the instructions in the README.md.
3.  **Make your changes**. Ensure your code adheres to the project's style.
4.  **Run tests and linting** to ensure your changes don't break anything.
    ```sh
    npm run lint
    npm test
    ```
5.  **Commit your changes** using a descriptive commit message. We follow the Conventional Commits specification. For example:
    - `feat: Add a new theme toggle feature`
    - `fix: Correct API key rotation logic`
    - `docs: Update deployment guide`
6.  **Push your branch** and open a pull request.
7.  **Provide a clear description** of the problem and solution in your pull request. Include the relevant issue number if applicable.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move file to..." not "Moves file to...").
- Limit the first line to 72 characters or less.
- Reference issues and pull requests liberally after the first line.

### JavaScript Styleguide

- All JavaScript code is linted with **ESLint**.
- The rules are defined in the `.eslintrc.json` file. Please ensure your code passes the linter before submitting a pull request.

Thank you for your contribution! 🫂
