# Tiny Threads - Baby Dresses E-commerce Website

This is a full-stack e-commerce website for selling baby dresses, built with Next.js, Prisma, and Azure SQL Database.

## Features

- User authentication (sign up, sign in)
- Product categories and listings
- Product details with size and color options
- Shopping cart functionality
- Checkout process
- User account and order history
- Admin dashboard for product management

## Tech Stack

- **Frontend**: Next.js with App Router, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Azure SQL Server with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Azure SQL Database (or local SQL Server for development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/baby-dresses-ecommerce.git
cd baby-dresses-ecommerce
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file based on `.env.example` and fill in your database connection string and other environment variables.

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Seed the database with initial data (optional):

```bash
npx prisma db seed
```

6. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application running.

## Project Structure

- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and shared logic
- `/prisma` - Database schema and migrations

## Database Setup

1. Create an Azure SQL Database instance
2. Update the `.env` file with your connection string
3. Run migrations with `npx prisma migrate dev`

## Deployment

1. Create a production build:

```bash
npm run build
# or
yarn build
```

2. Deploy to your hosting provider of choice (Vercel recommended for Next.js applications).

## License

MIT
