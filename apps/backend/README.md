# 🍔 Feedy API

<p align="center">
  <img src="https://i.imgur.com/BG7vGgK.png" alt="Feedy Logo" width="300">
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/NestJS-10.0.0-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS"></a>
  <a href="#"><img src="https://img.shields.io/badge/Prisma-5.0.0-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma"></a>
  <a href="https://feedy-backend.vercel.app/api"><img src="https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="API Docs"></a>
</p>

<p align="center">
  <b>✨ Deployed at <a href="https://feedy-backend.vercel.app/">https://feedy-backend.vercel.app/</a> ✨</b><br>
  <b>📚 Documentation at <a href="https://feedy-backend.vercel.app/api">https://feedy-backend.vercel.app/api</a> 📚</b>
</p>

## 🌟 Overview

Feedy API is the backend for a food delivery platform connecting restaurants, customers, and couriers. Built with NestJS and Prisma ORM for optimal performance and maintainability.

## 🚀 Key Features

- **User Management** - Registration, authentication and profiles
- **Restaurant System** - Profiles, menus and order management
- **Order Processing** - Creation, tracking and status updates
- **Delivery System** - Courier assignment and delivery tracking
- **Role-Based Access** - Different permissions for users, restaurants, couriers and admins

## 🔧 Quick Start

### Prerequisites

- Node.js v18+
- PostgreSQL v16+
- pnpm v8+

### Setup

```bash
# Install dependencies
pnpm install

# Create .env file with:
DATABASE_URL=""
JWT_SECRET_KEY=""
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=""
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV="development"

# Run development server
pnpm run start:dev
```

### Prisma Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Create and apply migrations
pnpm prisma migrate dev --name init

# Reset database (development only)
pnpm prisma migrate reset

# Open Prisma Studio (database GUI)
pnpm prisma studio
```

The data model includes entities for users, restaurants, menu items, orders, and couriers with appropriate relations. Prisma client is auto-generated and injected into the application using the PrismaService.

## 📚 API Reference

The API is organized into five main modules. Most endpoints require authentication with a Bearer token.

### 🔐 Authentication

```
POST /auth/register       # Create new user account
POST /auth/login          # Get access & refresh tokens
POST /auth/refresh-token  # Refresh access token
```

### 👤 Users

```
GET    /user              # Get all users (admin)
POST   /user              # Create user (admin)
GET    /user/{id}         # Get user profile
PATCH  /user/{id}         # Update user profile
DELETE /user/{id}         # Delete user (admin)
```

### 🍕 Restaurants

```
GET    /restaurant                         # List all restaurants
GET    /restaurant/{id}                    # View restaurant details
PATCH  /restaurant/{id}                    # Update restaurant (owner)
POST   /restaurant/request                 # Request new restaurant
GET    /restaurant/{id}/menu               # View restaurant menu
POST   /restaurant/{id}/menu               # Add menu item (owner)
PATCH  /restaurant/{id}/menu/{menuItemId}  # Update menu item (owner)
```

### 🛒 Orders

```
POST   /order                    # Create new order
GET    /order/{id}               # View order details
PATCH  /order/{id}/prepare       # Mark as preparing (restaurant)
PATCH  /order/{id}/deliver       # Mark as delivered (courier)
GET    /order/user/history       # View user order history
GET    /order/restaurant/orders  # View restaurant orders
```

### 🚚 Couriers

```
GET    /courier                # List couriers
POST   /courier/request        # Apply as courier
PATCH  /courier/{id}/status    # Update status (available/busy/offline)
```

For complete API documentation, visit [https://feedy-backend.vercel.app/api](https://feedy-backend.vercel.app/api)

## 📋 Project Structure

```
src/
├── auth/            # Authentication
├── common/          # Shared utilities
├── courier/         # Courier management
├── orders/          # Order processing
├── prisma/          # Database service
├── restaurants/     # Restaurant management
├── users/           # User management
└── main.ts          # Application entry
```

<div align="center">
  
<sub>Built by [@hraby](https://github.com/Hraby)</sub>

</div>