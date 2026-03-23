#  Consultant Booking System

A full-stack consultant booking system that allows users to browse, book, and manage appointments with consultants. Built with a modern tech stack, clean architecture, and scalability in mind.

---

##  Project Overview

This project is a **full-stack web application** consisting of:

- **Frontend (client)** → React + Vite + TypeScript  
- **Backend (server)** → Node.js + Express + Prisma  
- **Database** → PostgreSQL  
- **RateLimit & Infrastructure** → Redis + Docker  

It demonstrates real-world backend practices such as:
- RESTful API design
- Database modeling with Prisma
- Environment configuration
- Scalable architecture

---

##  Features

###  User
- Register & Login
- Browse consultants
- Book appointments
- Manage System

###  System
- RESTful API
- Prisma ORM integration
- Environment-based configuration
- Scalable backend setup

###  Performance & DevOps
- Docker support for services
- Redis integration (for rate-limit / future improvements)

---

##  Tech Stack

###  Frontend (`client`)
- React
- TypeScript
- Vite
- Zod
- Redux

### ⚙️ Backend (`server`)
- Node.js
- Express.js
- Prisma ORM
- Zod

### 🗄️ Database
- PostgreSQL

### 🔧 Tools
- Docker & Docker Compose
- Redis

---

## ⚙️ Environment Variables

### 🔙 Backend (`server/.env`)

PORT=8000
DATABASE_URL=your_database_url

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

REDIS_HOST=localhost
REDIS_PORT=6379


---

###  Frontend (`client/.env`)
VITE_API_URL=http://localhost:8000/api/v1


---

##  Getting Started

### 1️⃣ Clone the Repository
git clone https://github.com/SayarGyi007-lab/consultant_booking.git

cd consultant_booking


---

##  Backend Setup

cd server
npm install


### Run database (Docker)

docker-compose up -d


### Run Prisma migrations

npx prisma migrate dev


### Start backend server

npm run dev


---

##  Frontend Setup

- cd client
- npm install
- npm run dev


---

##  API Base URL

http://localhost:8000/api/v1


---

##  Architecture Highlights

- Clear separation of frontend and backend
- Prisma ORM for type-safe database access
- Environment-based configuration
- Docker-ready infrastructure
- Scalable foundation for future features

---

##  Future Improvements

-  Advanced booking scheduling
-  Payment integration
-  Email / real-time notifications
-  Background jobs (RabbitMQ)

---

##  Docker Support

The backend includes a `docker-compose.yml` file for:

- PostgreSQL
- Redis

Run services:

docker-compose up -d
