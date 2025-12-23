# TaleForge

A modern webnovel reading platform built with Next.js 16, featuring role-based access for readers, authors, and admins.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

## Overview

Inkwell is a free webnovel platform where authors can publish their stories and readers can discover, read, and engage with content. No paywalls, no coins — just stories.

## Features

### For Readers

- Browse and search novels by title, author, tags
- Read chapters with customizable reader settings (font size, line height, theme)
- Personal library with reading progress tracking
- "Continue reading" from where you left off
- Comment on chapters
- Review and rate novels (1-5 stars)

### For Authors

- Create and manage novels (title, description, cover, status, tags)
- Write and organize chapters
- Draft/publish toggle for chapters
- View stats (views, reviews) on your work
- Preview chapters before publishing

### For Admins

- User management (promote/demote roles, activate/deactivate)
- Content moderation (hide/delete novels)
- Tag management (CRUD)
- Author request approval system
- Platform statistics dashboard

## Tech Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 16 (App Router) |
| Language         | TypeScript              |
| Styling          | Tailwind CSS v4         |
| UI Components    | shadcn/ui               |
| Authentication   | Better Auth             |
| Database         | PostgreSQL              |
| ORM              | Prisma                  |
| Hosting          | Vercel                  |
| Database Hosting | Neon                    |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (local) or Neon account
- pnpm (recommended) or npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/inkwell.git
cd inkwell
```
````

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/inkwell_dev"
BETTER_AUTH_SECRET="your-secret-min-32-characters"
BETTER_AUTH_URL="http://localhost:3000"
```

5. Run database migrations

```bash
pnpm prisma migrate dev
```

6. Seed the database (optional)

```bash
pnpm prisma db seed
```

7. Start development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test Accounts

After seeding, these accounts are available:

| Role   | Email               | Password  |
| ------ | ------------------- | --------- |
| Admin  | admin@webnovel.com  | admin123  |
| Author | author@webnovel.com | author123 |
| Reader | reader@webnovel.com | reader123 |

## Project Structure

```
├── app/
│   ├── (admin)/              # Admin dashboard routes
│   ├── (author)/             # Author dashboard routes
│   ├── (auth)/               # Login, register pages
│   ├── (dashboard)/          # Reader dashboard routes
│   ├── api/                  # API routes
│   │   └── auth/[...all]/    # Better Auth handler
│   ├── novels/               # Public novel pages
│   │   ├── [slug]/           # Novel detail
│   │   │   └── chapter/[number]/  # Chapter reader
│   ├── search/               # Search page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/
│   ├── admin/                # Admin components
│   ├── auth/                 # Auth forms, login prompt
│   ├── author/               # Author dashboard components
│   ├── comments/             # Comment components
│   ├── dashboard/            # User dashboard components
│   ├── layout/               # Navbar, footer, sidebar
│   ├── novels/               # Novel cards, grids, lists
│   ├── reader/               # Reader settings, navigation
│   ├── reviews/              # Review components, star rating
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── auth.ts               # Better Auth server config
│   ├── auth-client.ts        # Better Auth client
│   ├── auth-server.ts        # Session helpers
│   ├── prisma.ts             # Prisma client singleton
│   ├── metadata.ts           # SEO utilities
│   └── utils.ts              # Helper functions
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Seed script
│   └── generated/            # Generated Prisma client
└── public/                   # Static assets
```

## Database Schema

```
User ─────┬───── Novel ─────┬───── Chapter
          │                 │
          │                 ├───── NovelTag ───── Tag
          │                 │
          ├───── LibraryEntry (tracks reading progress)
          │
          ├───── NovelReview (1 per user per novel)
          │
          ├───── ChapterComment
          │
          └───── AuthorRequest (role upgrade requests)
```

## Scripts

| Command                      | Description                  |
| ---------------------------- | ---------------------------- |
| `pnpm dev`                   | Start development server     |
| `pnpm build`                 | Build for production         |
| `pnpm start`                 | Start production server      |
| `pnpm lint`                  | Run ESLint                   |
| `pnpm prisma studio`         | Open Prisma database GUI     |
| `pnpm prisma migrate dev`    | Run migrations (development) |
| `pnpm prisma migrate deploy` | Run migrations (production)  |
| `pnpm prisma db seed`        | Seed database                |
| `pnpm prisma generate`       | Generate Prisma client       |

## Deployment

### Vercel + Neon

1. **Neon Setup**

   - Create account at [neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string

2. **Vercel Setup**

   - Import GitHub repo at [vercel.com](https://vercel.com)
   - Add environment variables:
     - `DATABASE_URL` — Neon connection string
     - `BETTER_AUTH_SECRET` — Run `openssl rand -base64 32`
     - `BETTER_AUTH_URL` — Your production URL

3. **Run Migrations**

   ```bash
   DATABASE_URL="your-neon-url" pnpm prisma migrate deploy
   ```

4. **Deploy**
   - Push to main branch
   - Vercel auto-deploys

### Build Configuration

Ensure `package.json` has:

```json
{
	"scripts": {
		"build": "prisma generate && next build",
		"postinstall": "prisma generate"
	}
}
```

## Environment Variables

| Variable             | Description                           | Required |
| -------------------- | ------------------------------------- | -------- |
| `DATABASE_URL`       | PostgreSQL connection string          | Yes      |
| `BETTER_AUTH_SECRET` | Auth encryption secret (min 32 chars) | Yes      |
| `BETTER_AUTH_URL`    | App URL (e.g., http://localhost:3000) | Yes      |

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ☕ and late nights.

```
