# Microservices Mini Project

Sebuah aplikasi microservices dengan arsitektur modern yang terdiri dari frontend React dan empat layanan backend yang terpisah (user, product, order, dan payment service).

## 📋 Daftar Isi
- [Arsitektur](#arsitektur)
- [Teknologi](#teknologi)
- [Struktur Project](#struktur-project)
- [Prerequisites](#prerequisites)
- [Instalasi dan Setup](#instalasi-dan-setup)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [API Documentation](#api-documentation)
- [Fitur](#fitur)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Contributing](#contributing)

## 🏗️ Arsitektur

Project ini menggunakan arsitektur microservices dengan komponen-komponen berikut:

```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   User Service  │
│   (React/Vite)  │     │   (Port 3001)   │
└─────────────────┘     └─────────────────┘
         │              
         │              ┌─────────────────┐
         └─────────────▶│ Product Service │
         │              │   (Port 3002)   │
         │              └─────────────────┘
         │              
         │              ┌─────────────────┐
         └─────────────▶│  Order Service  │
         │              │   (Port 3003)   │
         │              └─────────────────┘
         │              
         │              ┌─────────────────┐
         └─────────────▶│ Payment Service │
                        │   (Port 3004)   │
                        └─────────────────┘
                                │
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        │   (Port 5432)   │
                        └─────────────────┘
```

## 🛠️ Teknologi

### Frontend
- **React** - UI Library
- **Vite** - Build tool dan development server
- **TypeScript** - Type safety
- **Tailwind CSS** - CSS framework
- **React Router DOM** - Client-side routing
- **React Icons** - Icon components
- **Recharts** - Data visualization

### Backend Services
- **Bun** - JavaScript runtime dan package manager
- **Hono** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **bcryptjs** - Password hashing
- **JWT** - Authentication

### DevOps
- **Docker Compose** - Container orchestration
- **PostgreSQL** - Database management

## 📁 Struktur Project

```
mini-project/
├── docker-compose.yml          # Container orchestration
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   └── assets/            # Static assets
├── user-service/              # User management service
├── product-service/           # Product management service
├── order-service/             # Order management service
└── payment-service/           # Payment processing service
```

## 📋 Prerequisites

Pastikan sistem Anda memiliki:
- **Node.js** (v18 atau lebih tinggi)
- **Bun** (v1.0 atau lebih tinggi)
- **Docker dan Docker Compose**
- **Git**

## 🚀 Instalasi dan Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd mini-project
```

### 2. Setup Database
```bash
# Start PostgreSQL dengan Docker Compose
docker-compose up -d
```

### 3. Install Dependencies untuk Frontend
```bash
cd frontend
bun install
```

### 4. Install Dependencies untuk Setiap Service
```bash
# User Service
cd user-service
bun install

# Product Service
cd ../product-service
bun install

# Order Service
cd ../order-service
bun install

# Payment Service
cd ../payment-service
bun install
```

### 5. Setup Environment Variables
Buat file `.env` di setiap service directory dengan konfigurasi berikut:

**user-service/.env**
```env
DATABASE_URL=postgresql://postgres:root@localhost:5432/microservice
JWT_SECRET=your-secret-key-here
PORT=3001
```

**product-service/.env**
```env
DATABASE_URL=postgresql://postgres:root@localhost:5432/microservice
JWT_SECRET=your-secret-key-here
PORT=3002
```

**order-service/.env**
```env
DATABASE_URL=postgresql://postgres:root@localhost:5432/microservice
JWT_SECRET=your-secret-key-here
PORT=3003
```

**payment-service/.env**
```env
DATABASE_URL=postgresql://postgres:root@localhost:5432/microservice
JWT_SECRET=your-secret-key-here
PORT=3004
```

## 🎮 Menjalankan Aplikasi

### 1. Start Database
```bash
docker-compose up -d
```

### 2. Start Backend Services (di terminal terpisah)
```bash
# Terminal 1 - User Service
cd user-service
bun run dev

# Terminal 2 - Product Service
cd product-service
bun run dev

# Terminal 3 - Order Service
cd order-service
bun run dev

# Terminal 4 - Payment Service
cd payment-service
bun run dev
```

### 3. Start Frontend
```bash
# Terminal 5 - Frontend
cd frontend
bun run dev
```

Aplikasi akan tersedia di:
- **Frontend**: http://localhost:5173
- **User Service**: http://localhost:3001
- **Product Service**: http://localhost:3002
- **Order Service**: http://localhost:3003
- **Payment Service**: http://localhost:3004

## 📖 API Documentation

### User Service (Port 3001)
- `GET /users` - Get all users
- `POST /users` - Create new user
- `POST /users/login` - User login
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Product Service (Port 3002)
- `GET /products` - Get all products
- `POST /products` - Create new product
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Order Service (Port 3003)
- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get order by ID
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

### Payment Service (Port 3004)
- `GET /payments` - Get all payments
- `POST /payments` - Create new payment
- `GET /payments/:id` - Get payment by ID
- `PUT /payments/:id` - Update payment

## ✨ Fitur

### Frontend Features
- **Dashboard Analytics** - Visualisasi data dengan charts
- **User Management** - CRUD operations untuk users
- **Product Management** - CRUD operations untuk products
- **Order Management** - CRUD operations untuk orders
- **Payment Management** - CRUD operations untuk payments
- **Authentication** - Login/logout system
- **Responsive Design** - Mobile-friendly interface

### Backend Features
- **JWT Authentication** - Secure token-based auth
- **CORS Support** - Cross-origin resource sharing
- **RESTful APIs** - Standard REST endpoints
- **Database Integration** - PostgreSQL with connection pooling
- **Error Handling** - Comprehensive error responses
- **Middleware Support** - Authentication and authorization

## 🔧 Development

### Code Structure
Setiap service mengikuti struktur yang konsisten:
```
service/
├── src/
│   ├── index.ts           # Entry point
│   ├── db.ts             # Database configuration
│   └── middleware/       # Custom middleware
├── routes/               # API routes
└── package.json         # Dependencies
```

### Scripts yang Tersedia
```bash
# Development
bun run dev

# Production Build
bun run build

# Start Production
bun run start
```

### Database Schema
Database menggunakan PostgreSQL dengan tables:
- `users` - User information
- `products` - Product catalog
- `orders` - Order records
- `payments` - Payment transactions

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Pastikan PostgreSQL running
docker-compose ps

# Restart database jika perlu
docker-compose down
docker-compose up -d
```

**Port Already in Use**
```bash
# Check port usage
netstat -ano | findstr :3001

# Kill process jika perlu
taskkill /PID <process-id> /F
```

**Missing Dependencies**
```bash
# Clean install
rm -rf node_modules bun.lockb
bun install
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- Developer: [Your Name]
- Project: Microservices Mini Project
- Date: July 2025

---

Untuk pertanyaan atau dukungan, silakan buka issue di repository ini.
