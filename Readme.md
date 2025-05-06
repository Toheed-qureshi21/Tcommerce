# 🛒 Tcommerce – Full Stack eCommerce Platform

A complete eCommerce web application built with the **MERN stack**, supporting secure authentication, payment processing, media uploads, and more.

## 🚀 Features

- 🔐 Authentication with JWT & OAuth (Google, GitHub)
- 📧 Email verification (via SMTP)
- 🛍️ Cart and order management
- 💳 Stripe payment gateway
- 🌤️ Image uploads with Cloudinary
- 🪄 Modern UI with Tailwind CSS & Framer Motion
- 📊 Admin dashboard with analytics
- 📦 Production-ready build scripts

---

## 🧱 Tech Stack

### 🖥️ Frontend
- ⚛️ React 19
- 🌬️ Tailwind CSS 4
- ⚙️ Redux Toolkit
- 📦 Axios, React Router, Toastify, Framer Motion, Recharts

### 🔧 Backend
- 🟩 Node.js
- 🚂 Express.js
- 🍃 MongoDB & Mongoose
- 🔑 JSON Web Tokens
- 📤 Cloudinary
- 📧 Nodemailer / Brevo SMTP
- 💳 Stripe

---

## 📁 Project Structure

Tcommerce/
├── Backend/
│ └── server.js
├── Frontend/
│ └── (React app)
├── .env
├── package.json (root)
└── README.md


---

## ⚙️ Scripts

### 📦 From root:

- `npm run dev` — Start backend with file watching  
- `npm start` — Start backend  
- `npm run build` — Install & build both backend and frontend

### 🖥️ From Frontend:

- `npm run dev` — Start Vite dev server  
- `npm run build` — Build production frontend  
- `npm run preview` — Preview production frontend  

---

## 🌐 Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
PORT=3000
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NODE_ENV=development
STRIPE_SECRET_KEY=
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000

# Email (Brevo SMTP)
BREVO_SMTP_LOGIN=
BREVO_SMTP_MASTER_PASSWORD=
BREVO_SMTP_EMAIL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/github/callback
```
---

### 🛠️ Installation
git clone https://github.com/your-username/Tcommerce.git
cd Tcommerce

# Install backend dependencies
npm install

# Install frontend dependencies
npm install --prefix Frontend

# Start development server
npm run dev

---
### 📦 Build for Production
# Build frontend and install everything
npm run build

---
### 🧑‍💻 Author
# Toheed Qureshi🧑‍💻

