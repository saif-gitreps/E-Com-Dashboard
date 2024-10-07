# Modern and Simple E-Commerce with a simple Admin Dashboard webapp

A full-featured, modern e-commerce platform built with **Next.js**, **Tailwind CSS**, **Prisma (SQLite)**, and **Stripe** for transaction management, including webhook confirmations.

## Features

🔧 **Built with modern technology from scratch**
- ⚡️ Fast and responsive, powered by [Next.js 14](https://nextjs.org/)

🎨 **Clean UI and simple UX**
- 🌟 Includes a streamlined home page and an easy-to-navigate product purchase flow.
- 🛠 Clean, modern design using [shadcn-ui](https://github.com/shadcn-ui) and **Tailwind CSS**.

🛒 **Full e-commerce functionality**
- Users can:
  - 🛍 Purchase products with secure **Stripe** transactions.
  - 📧 Receive order confirmations via email.

🔐 **Authentication and security**
- Secure authentication for both admins and users, ensuring a safe shopping experience.

📊 **Admin dashboard**
- 📋 Admins can manage products with full control, including:
  - Editing product details.
  - Deleting products (with restrictions).
  - Setting product visibility on the marketplace.
  - **Note**: Admins cannot delete products that have pending orders, ensuring data integrity.

✅ **Product verification**
- Product verification ensures only high-quality products are available for purchase.

📧 **Custom email notifications**
- 📨 Sends beautifully designed email confirmations after purchases.

💻 **Tech Stack**
- 🖥 Fully written in **TypeScript** for type safety and scalability.
- 📜 Utilizes **Zod** for strict input validation and error handling.
- 🗄 **SQLite** with **Prisma** for easy database migrations during development.
- 📁 Simple file storage and management using **Node.js**.
- 🚀 Custom caching strategy combining Next.js's **unstable_cache** and React’s **reactCache**, providing an optimized user experience (UX).

🎁 **Additional Features**
- 🔄 Highly customizable and extendable.
- 📱 Fully responsive design for mobile and desktop.

## Installation
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
