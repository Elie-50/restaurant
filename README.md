# 🍽️ Restaurant App

A modern restaurant management web application built with **Next.js 15+, TypeScript, MySQL, Drizzle ORM, and Zustand**.  
This stack was carefully chosen to provide scalability, performance, and a smooth developer experience.

---

## 🚀 Tech Stack & Why

### **Framework: Next.js 15+**
- **Why Next.js?**
  - Hybrid rendering (SSR, SSG, ISR) → perfect for fast menu pages, dynamic reservations, etc.
  - Built-in **App Router** for clean routing and layouts.
  - Optimized **Image & Font handling** → great for menus, photos, and branding.
  - Edge & serverless support → scalable for peak restaurant hours.

### **Language: TypeScript**
- **Why TypeScript?**
  - Strong typing reduces runtime errors in ordering, reservations, and payment flows.
  - Great developer tooling (autocompletion, refactoring).
  - Makes team collaboration safer and faster.

### **Database: MySQL**
- **Why MySQL?**
  - Relational database with strong consistency → reliable for orders, reservations, and user accounts.
  - Well-known, stable, and widely supported.
  - Easy integration with Drizzle ORM and scalable for future growth.

### **ORM: Drizzle ORM**
- **Why Drizzle?**
  - Type-safe schema → database queries are checked at compile time.
  - Lightweight and fast, unlike heavy ORMs.
  - Built-in **migrations** make schema changes simple and safe.
  - Fits perfectly with TypeScript-first workflows.

### **State Management: Zustand**
- **Why Zustand?**
  - Minimal and intuitive API (less boilerplate than Redux).
  - Great for managing UI + authentication state (e.g., logged-in user, cart, reservation form).
  - Persisted state support for keeping data even after refresh.
  - No unnecessary complexity — lean and powerful.

---

## ✨ Benefits of this Stack
- **Performance-first:** Next.js + MySQL ensures both frontend and backend scale well under traffic.
- **Developer-friendly:** TypeScript + Drizzle ORM provide end-to-end type safety.
- **Maintainable:** Clear separation of concerns (UI, state, data).
- **Scalable:** Easy to extend with features like loyalty programs, online ordering, or admin dashboards.

---

## 📌 Features (Planned/Implemented)
- User authentication (JWT + HttpOnly cookies).
- Responsive login/signup forms.

---

## 🛠️ Getting Started

1. Clone repo
   ```bash
   git clone https://github.com/elie-50/restaurant.git
   cd restaurant-app
   ```

2. Install dependencies
    ```bash
    npm install
    ```
3. Setup .env
    ```bash
    DATABASE_URL="mysql://username:password@localhost:3306/restaurant"
    JWT_SECRET="supersecretkey"
    ```
4. Run migrations
    ```bash
    npx drizzle-kit push
    ```

5. Start dev server
    ```bash
    npm run dev
    ```

