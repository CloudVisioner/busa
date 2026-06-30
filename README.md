# BUSA — Korean Student Community Platform

A community platform for Uzbek students living in South Korea (Busan). Built solo, from database design through deployment.

## Features

- Role-based authentication (student / admin)
- Student profile management
- Community posts & feed
- Comments and likes
- Dynamic content management (events, gallery, visa info)
- Admin panel with statistics dashboard
- Responsive design (mobile + desktop)

## Tech stack

- **Backend:** NestJS, GraphQL, Prisma ORM, Supabase
- **Database:** PostgreSQL (via Supabase)
- **Auth:** JWT, role-based access control
- **Deployment:** Linux VPS, Docker, Nginx

## Architecture

This is the backend repository. It's structured as a standalone NestJS API, separate from the frontend (Next.js) repository. The backend exposes REST endpoints consumed by the frontend client, with Prisma ORM handling the connection to a PostgreSQL database hosted on Supabase. Authentication is handled via JWT, with role-based guards protecting admin-only routes.

## Setup

\`\`\`bash
npm install
npm run start:dev
\`\`\`

Requires a `.env` with `DATABASE_URL` (Supabase connection string) and JWT secret.
