# DevSecOps-ci-cd-scanner

This project demonstrates a fully functional DevSecOps CI/CD pipeline built using GitHub Actions. It showcases the integration of automated security testing directly into the software development lifecycle to "shift left" on security.

## Project Overview

The repository contains a deliberately vulnerable Node.js/Express web application. The core of the project lies in the `.github/workflows` directory, which contains automated pipelines using industry-standard security tools. Every time code is pushed or a Pull Request is opened, these scanners run automatically.

> **Warning:** The application (`src/app.js`) is intentionally designed with security flaws (OWASP Top 10) for demonstration purposes. **DO NOT** run or deploy this application in a production environment.

## The Toolchain

This pipeline implements three distinct types of security scanning:

### 1. Static Application Security Testing (SAST)
*   **Tool:** [Semgrep](https://semgrep.dev/)
*   **Workflow:** `semgrep-sast.yml`
*   **What it does:** Analyzes the application's source code (`src/app.js`) to find coding flaws.
*   **Vulnerabilities demonstrated:** SQL Injection, OS Command Injection.

### 2. Software Composition Analysis (SCA) & Container Scanning
*   **Tool:** [Trivy](https://aquasecurity.github.io/trivy/)
*   **Workflow:** `trivy-sca.yml`
*   **What it does:** Scans the `package.json` for known vulnerabilities (CVEs) in third-party dependencies. It also builds the Docker image and scans the OS layers for vulnerabilities.
*   **Vulnerabilities demonstrated:** Outdated `express` and `lodash` dependencies; outdated `node:14-alpine` Docker base image.

### 3. Secret Scanning
*   **Tool:** [TruffleHog](https://github.com/trufflesecurity/trufflehog)
*   **Workflow:** `secret-scanning.yml`
*   **What it does:** Scans the Git commit history and current file states for inadvertently exposed secrets (API keys, passwords).
*   **Vulnerabilities demonstrated:** Hardcoded AWS keys and database passwords in the source tree.

## How to use this project

To see the security pipelines in action:

1.  Fork or clone this repository to your own GitHub account.
2.  Navigate to the **Actions** tab on GitHub.
3.  Because the workflows trigger on `push`, you will see the initial run of the pipelines. Let them finish.
4.  Click on any of the workflow runs (e.g., "Semgrep SAST" or "Trivy SCA & Container Scan") to view the detailed logs.
5.  Expand the steps in the logs to see the specific vulnerabilities identified by the tools.

### Example Findings You Will See
*   **Semgrep:** Warnings about directly manipulating strings for SQL queries and using `child_process.exec` with user-supplied input.
*   **Trivy:** A table output listing CVEs associated with older versions of Lodash and Express, and OS-level vulnerabilities from the Alpine base image.
*   **Trufflehog:** A report indicating that AWS Access Keys and dummy passwords were found in `src/app.js`.

## Why this matters
By implementing these checks in a CI/CD pipeline, security issues are caught *before* they are ever deployed or merged into the main application. This drastically reduces the cost and risk of fixing vulnerabilities later in the lifecycle.
