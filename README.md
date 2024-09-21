# Playwright Testing Framework

## Overview

This repository contains a code for testing script for web applications using Playwright. It includes project
setup, configuration, automated test scripts, and detailed reporting of test results.

## Table of Contents

- [Project Setup](#1-project-setup)
- [Environment Setup](#2-environment-setup)
- [Install Dependencies](#3-install-dependencies)
- [Running Tests](#4-running-tests)
- [Automated Tests](#5-automated-tests)
- [Test Reports](#6-test-reports)

## 1. Project Setup

To get started with the Playwright testing framework, follow these steps to set up your project:

**Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/playwright-testing-framework.git
   cd playwright-testing-framework
   ```
## 2. Environment Setup
Prerequisites

    Node.js (v12 or higher)
    npm (Node package manager)

## 3. Install Dependencies
   ```bash
   npm install
   npx playwright install
   ```
   
## 4. Running Tests
   ```bash
   npx playwright test -g "login with correct details"
   npx playwright test -g "appointment booking test"
   npx playwright test -g "view upcoming booking"
   npx playwright test -g "cancel appointment booking test"
   ```
   

## 5. Automated Tests
### Running on specific browser
   ```bash
   npx playwright test --project=chromium
   npx playwright test --project=firefox
   npx playwright test --project=webkit
   ```

## 6. Test Reports
   ```bash
   npx playwright show-report
   ```