# 🍽️ Restaurant App

A modern restaurant management web application built with **Next.js 15+, TypeScript, PostgreSQL, Drizzle ORM, and Zustand**.  
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

### **Database: PostgreSQL**
- **Why PostgreSQL?**

  - Advanced features like native UUIDs, JSON support, and rich indexing for complex queries.

  - Strong type system and reliability → safer for user accounts, orders, and reservations.

  - Easier integration with Drizzle ORM’s PostgreSQL driver, including .returning() support for inserts and updates.

  - Full support for enums, constraints, and migrations → makes schema evolution safer and simpler.

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
- **Performance-first:** Next.js + PostgreSQL ensures both frontend and backend scale well under traffic.
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
  cd restaurant
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
  npx drizzle-kit generate
  npx drizzle-kit migrate
  npx drizzle-kit push
  ```

5. Start dev server
  ```bash
  npm run dev
  ```

