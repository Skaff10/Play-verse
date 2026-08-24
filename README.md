# 🎬🎮 PlayVerse

**PlayVerse** is a modern, unified, gamified entertainment tracking platform designed for movies, TV series, and video games. Built with Next.js 15, Prisma, and Tailwind CSS, PlayVerse allows users to log their media activity, rate and review titles, earn XP, track stats, and compete on global leaderboards.

---

## ✨ Features

- **🎮 3-in-1 Entertainment Tracker**: Track Movies, TV Series, and Video Games in one seamless application.
- **⚡ Gamified XP System**: Earn XP for logging media, marking items as completed, rewatching/replaying, rating titles, and writing reviews.
- **🏆 Global Leaderboards**: Compete against other community members based on total XP and logged media counts.
- **🔍 Comprehensive Media Catalog & Search**: Discover movies and TV series powered by **TMDB**, and video games powered by **RAWG**.
- **📚 Personal Library & Dashboard**: Manage your watchlist (`In Progress`, `Completed`, `Dropped`), view breakdown analytics, and revisit your logged history.
- **⭐ Weighted Community Ratings**: Smart rating algorithm that calculates fair weighted scores based on community ratings.
- **🔒 Firebase Authentication**: Secure user login and signup with Firebase Auth.
- **🎨 Sleek Modern UI**: Premium dark mode UI built with Tailwind CSS v4 and dynamic micro-interactions powered by Framer Motion.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with [SQLite](https://www.sqlite.org/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **External Data APIs**:
  - [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) for Movies & TV Series
  - [RAWG Video Games Database API](https://rawg.io/apidocs) for Video Games

---

## 📁 Project Structure

```text
play-verse/
├── prisma/
│   ├── schema.prisma       # Database schema (User, CatalogItem, UserEntry, ScoreEvent, RateLimit)
│   └── seed.ts             # Database seeding script for initial catalog data
├── src/
│   ├── app/
│   │   ├── api/            # API Route handlers (entries, catalog, leaderboards, search)
│   │   ├── auth/           # Login and Signup pages
│   │   ├── browse/         # Search & catalog browsing page
│   │   ├── dashboard/      # User dashboard & statistics overview
│   │   ├── item/[type]/[id]# Detail view & logger for specific movie/series/game
│   │   ├── leaderboards/   # Global leaderboard rankings page
│   │   ├── library/        # Personal user media library
│   │   ├── profile/        # User profile & score history
│   │   ├── globals.css     # Global CSS styling & design tokens
│   │   ├── layout.tsx      # Root layout & providers wrapper
│   │   └── page.tsx        # Dynamic landing page showcasing top titles & leaderboards
│   ├── components/         # Reusable React UI components (Navbar, MediaCard, HeroSlideshow, etc.)
│   └── lib/                # Database client, Firebase setup, and catalog helper utilities
├── .env.local              # Local environment configuration file
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

Follow these steps to set up and run PlayVerse locally on your machine.

### 1. Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` or `pnpm`

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/play-verse.git
cd play-verse
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory and populate it with your credentials:

```env
# External Data APIs
RAWG_API_KEY=your_rawg_api_key
TMDB_API_KEY=your_tmdb_api_key

# Firebase Client Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Note**: You can obtain free API keys from [RAWG](https://rawg.io/apidocs) and [TMDB](https://www.themoviedb.org/documentation/api), and set up a project on [Firebase Console](https://console.firebase.google.com/).

### 5. Setup Database

Generate the Prisma client, push the schema to SQLite, and optionally seed default media data:

```bash
# Generate Prisma Client & push schema to SQLite
npm run db:push

# (Optional) Seed initial catalog data
npm run db:seed
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 🎮 Gamification & XP System

PlayVerse rewards users for interacting with the platform and staying active:

| Action | XP Awarded |
| :--- | :--- |
| **Add Media to Library** | +10 XP |
| **Mark Status as Completed** | +25 XP |
| **Rewatch / Replay Item** | +15 XP |
| **Rate an Item** | +5 XP |
| **Write a Detailed Review** | +15 XP |

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Generates Prisma client, syncs DB schema, and builds the production bundle.
- `npm run start`: Starts the application in production mode.
- `npm run lint`: Runs ESLint checks across the codebase.
- `npm run db:push`: Pushes Prisma schema updates directly to the database.
- `npm run db:seed`: Seeds initial catalog items from TMDB & RAWG into your local database.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve PlayVerse:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
