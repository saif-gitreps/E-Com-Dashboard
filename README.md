# Assets Haven - A Platform for Trading and Downloading Digital Assets and Software

A full-featured, modern e-commerce platform with an Admin/Seller dashboard, where users can browse and purchase various digital products like themes, icons, software, PDFs, study materials, and more. Users can also become sellers, contributing to the community and earning profits, while admins maintain quality control over the products listed on the platform.

## Features

🔧 **Built from Scratch with Modern Technology**

-  ⚡️ Fast and responsive, powered by [Next.js 14](https://nextjs.org/).

🎨 **Clean UI and Simple UX**

-  🛠 Clean, modern, and compact design using [shadcn-ui](https://github.com/shadcn-ui) components and **Tailwind CSS**.

🧑🏻‍💻 **User Capabilities**

-  Browse and explore high-quality digital products and softwares.
-  Filter products by various criteria, such as category, price, sales, reviews, and date.
-  Search **intuitively** for desired products.
-  Add items to the cart without needing to be **authenticated**.
-  Download free products with a single click.
-  Authenticated users can:
   -  Purchase items in their cart securely via **card transactions**.
   -  Receive a **purchase receipt** via email.
   -  Access their purchased products with secure, limited **download links**.
   -  Leave **reviews** and **ratings** for purchased items.
   -  Become a seller and access their own **dashboard**.
   -  Monitor **sales** and manage product availability.
   -  Switch seamlessly between **seller** and **customer** roles with a single **sign-in**.
   -  Update personal details.

🔐 **Authentication and Security**

-  Stateless JWT authentication using secure HTTP-only cookies and the strong HS256 hashing algorithm.
-  Role-based authorization for admins and users.
-  Secure transactions powered by **Stripe** with **webhook** support.
-  Admin verification of products ensures only high-quality items are available on the platform.
-  Limited-time download links ensure that only verified buyers can download purchased products.
-  Download history and product links sent via email provide an extra layer of security.

📊 **Admin/Seller Dashboard**

-  Add/edit product details and manage product visibility on the marketplace.
-  Admins can view all users and monitor transactions on the platform.
-  Admins and sellers can delete products (with restrictions).
-  Sellers require admin verification to set product visibility for the first time.
-  Admins and sellers cannot delete products with pending orders, ensuring data integrity.

💻 **Tech Stack and Features**

-  🖥 Fully written in **TypeScript** for type safety and scalability.
-  📜 Uses **Zod** for strict input **validation** and error handling.
-  🗄 **PostgreSQL** with **Prisma** for seamless database migrations and efficient querying.
-  📁 Simple file storage and management using **Node.js**.
-  🚀 Custom **caching** strategy that combines Next.js's **unstable_cache** with React’s **reactCache** for optimized performance.
-  📨 Sends beautifully designed purchase receipts and history emails using **resend** and **react-email**.
-  🌄 **Paginated** browsing of products with previous/next navigation.
-  📁 Persistent **cart** state management using **Zustand**, ensuring users don't lose cart items.
-  🛒 Responsive **cart** feature and **hamburger menu** using **shadcn-ui** sheet components.

🎁 **Additional Features**

-  🔄 Highly customizable and extendable, with additional features planned for future updates.
-  📱 Fully responsive design for both mobile and desktop devices.

## Installation

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
