# Project: Where's Waldo (Photo Tagging App)

A full-stack photo tagging game where players find hidden characters in detailed scenes. Built as part of [The Odin Project](https://www.theodinproject.com/lessons/nodejs-where-s-waldo-a-photo-tagging-app) curriculum.

## How It Works

Select a scene, then click on the image to find the hidden characters. A dropdown appears at your click location: if you think you've found someone, select their name. The server validates your guess against stored coordinates and keeps track of your time. Find all characters to complete the scene and submit your name to the leaderboard.

## Features

- Multiple scenes with varying numbers of characters to find
- Character portraits with found/unfound visual states
- Server-side timing and coordinate validation (cheat-proof)
- Live timer during gameplay
- Hit/miss toast feedback
- Per-image leaderboard
- Responsive layout

## Tech Stack

**Frontend**

- React + React Router
- Vite
- CSS Modules

**Backend**

- Node.js + Express 5
- Prisma 7 + PostgreSQL
- Jest + SuperTest

**Infrastructure**

- Frontend: Netlify
- Backend: Render
- Database: Neon (serverless PostgreSQL)
- Images: Cloudinary

## Project Structure

```
project-wheres-waldo/
├── apps/
│   ├── client/          # React frontend
│   └── server/          # Express backend
├── .eslintrc.js
├── .prettierrc
└── package.json         # npm workspaces root
```

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL

### Setup

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/bowman025/project-wheres-waldo.git
cd project-wheres-waldo
npm install
```

1. Create a `.env` file at the root:

```
DATABASE_URL="postgresql://username:password@localhost:5432/waldo"
TEST_DATABASE_URL="postgresql://username:password@localhost:5432/waldo_test"
VITE_API_URL=http://localhost:3000/api
VITE_DEV_TOOLS=true
```

1. Run database migrations and seed:

```bash
cd apps/server
npx prisma migrate dev
npx prisma generate
npm run seed -w apps/server
```

1. Start both servers:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3000`.

### Running Tests

```bash
npm test -w apps/server
```

### Coordinate Picker

A developer tool for measuring character coordinates is available at `http://localhost:5173/dev` when `VITE_DEV_TOOLS=true` is set in your `.env`.
