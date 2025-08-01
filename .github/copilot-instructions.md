<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Tiny Threads - Baby Dresses E-commerce

This is a Next.js e-commerce project for selling baby dresses with Prisma ORM and Azure SQL Database.

## Context

- This is a full-stack e-commerce application using Next.js App Router
- The database schema is in `/prisma/schema.prisma`
- Authentication is handled with NextAuth.js
- State management for cart uses Zustand
- Styling uses Tailwind CSS

## API Structure

- API routes are in `/src/app/api`
- Main endpoints: products, categories, cart, orders, auth

## Best Practices

- Use TypeScript for all new code
- Keep components modular and reusable
- Follow RESTful principles for API routes
- Validate all user inputs
- Handle loading and error states appropriately
