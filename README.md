# Feedy - Setup Guide

Feedy is a food delivery platform that includes backend and frontend services (web and mobile). This guide outlines setup steps, dependency installation, and Docker usage for running services in a development environment.

---

## Prerequisites

- **Node.js** (LTS version recommended)
- **Docker & Docker Compose**
- **Package Manager**: `npm` (or `yarn`)

---

## Installation

This monorepo has separate dependencies for backend, web frontend, and mobile frontend. Run the following command from the root directory to install all dependencies at once:

```bash
npm run install:all
```

### Individual Installation Commands

If you only want to install specific parts:

- **Backend:** `npm run install:backend`
- **Frontend (Web):** `npm run install:frontend-web`
- **Frontend (Mobile):** `npm run install:frontend-mobile`

---

## Docker

### Start Database Only

To start only the database service in Docker:

```bash
docker-compose up -d db
```

### Start Backend + Database

To start both the backend and database services:

```bash
docker-compose up -d db backend
```

Backend should now be accessible at [http://localhost:3001](http://localhost:3001).

### Full Setup (All Services)

To start the entire stack (backend, web frontend, mobile frontend, database):

```bash
docker-compose up -d
```

---

## Running Services in Development Mode

Each service can be run individually in development mode.

### Backend (NestJS)

1. Navigate to the backend directory:

    ```bash
    cd apps/backend
    ```

2. Start the backend in development mode:

    ```bash
    npm run start:dev
    ```

### Web Frontend (Next.js)

1. Navigate to the web frontend directory:

    ```bash
    cd apps/frontend/web
    ```

2. Start the web frontend:

    ```bash
    npm run dev
    ```

### Mobile Frontend (React Native with Expo)

1. Navigate to the mobile frontend directory:

    ```bash
    cd apps/frontend/mobile
    ```

2. Start the mobile app using Expo:

    ```bash
    npx expo start
    ```

---

## Quick Reference Commands

| Action                   | Command                                   |
|--------------------------|-------------------------------------------|
| Install All Dependencies | `npm run install:all`                     |
| Start Database Only      | `docker-compose up -d db`                 |
| Start Backend            | `npm run start:dev` (in `apps/backend`)   |
| Start Web Frontend       | `npm run dev` (in `apps/frontend/web`)    |
| Start Mobile Frontend    | `npx expo start` (in `apps/frontend/mobile`) |

--- 