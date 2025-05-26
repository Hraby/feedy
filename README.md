# 🍔 Feedy - Full-Stack Food Delivery Platform

<p align="center">
  <img src="https://i.imgur.com/BG7vGgK.png" alt="Feedy Logo" width="250">
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version"></a>
  <a href="https://github.com/Hraby/feedy/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License"></a>
  <a href="https://feedy-three.vercel.app/"><img src="https://img.shields.io/badge/status-live-brightgreen?style=flat-square" alt="Status"></a>
  <br>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
  <br>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React%20Native-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>

<p align="center">
  <b>🚀 Live Web App: <a href="https://feedy-three.vercel.app/">feedy-three.vercel.app</a></b><br>
  <b>✨ Backend API: <a href="https://feedy-backend.vercel.app/">feedy-backend.vercel.app</a></b> (connects to Supabase PostgreSQL)<br>
  <b>📚 API Documentation: <a href="https://feedy-backend.vercel.app/api">feedy-backend.vercel.app/api</a></b>
</p>

Feedy is a comprehensive, **full-stack food delivery platform** built from the ground up, connecting customers, restaurants, and couriers through intuitive web and mobile interfaces. This project showcases a modern technology stack, a robust multi-role system, and a focus on a seamless user experience, all managed within an efficient monorepo architecture.

<p align="center">
  <img src="https://i.imgur.com/seClqwK.gif" alt="Feedy Platform Demo" width="75%">
</p>


## ✨ Project Highlights & Technical Achievements

*   **End-to-End Full-Stack Solution →** Developed a complete platform including a NestJS backend, Next.js web frontend, and React Native (Expo) mobile apps
*   **Robust Multi-Role System →** Implemented distinct functionalities and secure access control (JWT-based) for four user roles: Customer, Restaurant, Courier, and Admin
*   **Monorepo Architecture with TypeScript →** Leveraged npm workspaces and TypeScript across the entire stack for enhanced type safety, code sharing, and development efficiency
*   **Scalable Cloud Deployment →** Successfully deployed the backend API to Vercel and the PostgreSQL database to Supabase, ensuring reliability and scalability
*   **Interactive Mapping →** Integrated Mapy.cz API for address lookup, displaying restaurant locations, and potentially courier tracking

## 🌟 Key Features

*   **Comprehensive User Management →** Secure registration, login, and profile management for all roles
*   **Restaurant Portal →** Intuitive interface for restaurants to manage their profile, menu items, and process incoming orders
*   **Customer Experience →** Easy browsing of restaurants & menus, streamlined order placement, and (conceptual) real-time order tracking
*   **Courier Operations →** System for order assignment and delivery status updates
*   **Admin Panel →** Centralized oversight for user management and platform configuration
*   **Native Mobile Apps →** Cross-platform iOS and Android applications via React Native (Expo) for a consistent on-the-go experience

**Mobile App Preview:**
<p align="center">
  <img src="https://i.imgur.com/72dPl5i.png" alt="Feedy Mobile App - Screen 1" width="30%">
  &nbsp;
  <img src="https://i.imgur.com/JYv6Ig5.png" alt="Feedy Mobile App - Screen 2" width="30%">
  &nbsp;
  <img src="https://i.imgur.com/6Su17Io.png" alt="Feedy Mobile App - Screen 3" width="30%">
</p>

## 🛠️ Tech Stack

*   **Backend (`/apps/backend`):** NestJS (Node.js), TypeScript, Prisma, PostgreSQL (Supabase/Docker), JWT, Swagger
*   **Frontend - Web (`/apps/frontend/web`):** Next.js (React), TypeScript, Tailwind CSS
*   **Frontend - Mobile (`/apps/frontend/mobile`):** React Native, Expo, TypeScript
*   **Development & Tools:** npm Workspaces, Docker, Docker Compose, ESLint, Prettier

## 🏗️ Project Architecture

Feedy utilizes a **monorepo** structure managed with `npm workspaces`, promoting code reusability and simplified dependency management across its three main applications: `backend`, `frontend/web`, and `frontend/mobile`. All frontends communicate with the central backend API.

<!-- Optional: Add a simple architecture diagram if you have one -->
<!-- <p align="center">
  <img src="YOUR_ARCHITECTURE_DIAGRAM_URL" alt="Feedy Architecture" width="60%">
</p> -->

## 🚀 Getting Started (For Developers)

<details>
<summary>Click to expand/collapse local development setup instructions</summary>

Follow these instructions to set up and run the Feedy project locally.

### Prerequisites

*   Node.js (LTS version, v18+ recommended)
*   npm (v8+ recommended)
*   Docker & Docker Compose
*   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Hraby/feedy.git
    cd feedy
    ```

2.  **Install all dependencies:**
    ```bash
    npm run install:all
    ```
    *(This script utilizes npm workspaces. If issues arise, ensure your npm version supports workspaces or install dependencies in each `apps/*` directory individually.)*

3.  **Environment Setup (`.env` files):**
    Create `.env` files in `apps/backend`, `apps/frontend/web`, and `apps/frontend/mobile` based on the examples below. **Never commit actual `.env` files.**

    *   **Backend (`apps/backend/.env`):**
        ```env
        DATABASE_URL="postgresql://user:password@localhost:5432/feedy_db?schema=public"
        JWT_SECRET_KEY="your-strong-jwt-secret-key-for-backend"
        JWT_EXPIRES_IN=15m
        JWT_REFRESH_SECRET="your-strong-jwt-refresh-secret-key"
        JWT_REFRESH_EXPIRES_IN=7d
        NODE_ENV="development"
        ```

    *   **Frontend - Web (`apps/frontend/web/.env.local`):**
        ```env
        JWT_SECRET_KEY="some-client-side-jwt-secret-if-needed" # Typically not the same as backend's signing key
        BACKEND_URL="http://localhost:3001"
        MAPY_API_KEY="your-mapy.cz-api-key"
        # SUPABASE_URL="your-supabase-project-url" # If used directly by frontend
        # SUPABASE_ANON_KEY="your-supabase-anon-key" # If used directly by frontend
        ```

    *   **Frontend - Mobile (`apps/frontend/mobile/.env`):**
        ```env
        JWT_SECRET_KEY="some-client-side-jwt-secret-if-needed-for-mobile"
        BACKEND_URL="http://localhost:3001"
        EXPO_PUBLIC_MAPY_API_KEY="your-mapy.cz-api-key"
        ```

### Running the Application

1.  **Start Local Database (Docker):**
    ```bash
    docker-compose up -d db
    ```
2.  **Start Backend:**
    ```bash
    cd apps/backend && npm run start:dev
    ```
3.  **Start Web Frontend:**
    ```bash
    cd apps/frontend/web && npm run dev
    ```
4.  **Start Mobile Frontend (Expo):**
    ```bash
    cd apps/frontend/mobile && npx expo start
    ```

### Prisma Commands (Backend Development)

Navigate to `apps/backend` to run:
```bash
npx prisma generate
npx prisma migrate dev --name your-migration-name
npx prisma migrate reset # Development only
npx prisma studio
```
</details>

## 💡 Future Enhancements (Ideas)
*   Real-time pop-up notifications for order status changes
*   Integration of a payment gateway
*   AI-powered restaurant/dish recommendations
*   Advanced courier route optimization

## 🧑‍💻 The Team

This project was brought to life by a dedicated team of developers:

*   **[hraby](https://github.com/Hraby)** (Michal Hrabal) - Project Lead, Backend Development
*   **[mirekondro](https://github.com/mirekondro)** (Miroslav Ondroušek) - Frontend Web Development
*   **[honzabehuncik](https://github.com/honzabehuncik)** (Jan Běhunčík) - Frontend Mobile Development

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  <sub>Built with passion and ☕ by the Feedy team</sub>
</p>
