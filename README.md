
  # FreshMarket — Food Product Selling Page

  A full-stack organic food marketplace: a Vite + React + TypeScript frontend backed by a
  self-hosted Node.js + Express + PostgreSQL (Prisma) API — no third-party backend-as-a-service.

  ## Project layout

  - `src/` — the frontend (Vite + React + TypeScript + Tailwind + shadcn/ui)
  - `server/` — the backend API (Express + Prisma + PostgreSQL)

  ## Running locally

  ### 1. Database

  Make sure PostgreSQL is running locally and create a database/user matching `server/.env`
  (see `server/.env.example`). Default expected connection:

  ```
  postgresql://freshmarket:freshmarket@localhost:5432/freshmarket
  ```

  ### 2. Backend API

  ```
  cd server
  npm install
  copy .env.example .env      # then edit DATABASE_URL / JWT_SECRET if needed
  npx prisma migrate dev --name init
  npm run seed                # seeds an admin user, product catalog, and promo codes
  npm run dev                 # starts the API on http://localhost:4000
  ```

  Seeded admin login: `admin@freshmarket.com` / `admin123`

  ### 3. Frontend

  From the project root:

  ```
  npm i
  npm run dev
  ```

  The frontend expects the API at `VITE_API_URL` (see `.env`, defaults to `http://localhost:4000/api`).

  ## Deploying (frontend on Vercel + backend elsewhere)

  Vercel only hosts the static frontend — it cannot run the Express API or reach your local
  Postgres. Deploy the backend to a normal Node host (Railway, Render, Fly.io, etc.) and point a
  cloud-hosted Postgres (e.g. [Neon](https://neon.tech)) at it. Order matters a little because the
  two deployments need each other's URLs:

  ### 1. Create the cloud database (Neon)

  1. Sign up at neon.tech, create a project → copy the connection string it gives you
     (looks like `postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require`).
  2. Locally, temporarily point `server/.env`'s `DATABASE_URL` at that string and run:
     ```
     cd server
     npx prisma migrate deploy
     npm run seed
     ```
     This creates the schema and seed data (admin user, products, promo codes) on Neon.

  ### 2. Deploy the backend (Railway or Render)

  1. Create a new Web Service from the `animinatesphere/FreshMarket` GitHub repo, with **root
     directory set to `server/`**.
  2. Build command: `npm install && npm run build`. Start command: `npm start`
     (this runs `prisma migrate deploy` automatically before booting, so future schema changes
     apply on every deploy).
  3. Set environment variables on the host: `DATABASE_URL` (the Neon string), `JWT_SECRET` (a new
     long random value — don't reuse the local dev one), `PORT` (most hosts set this for you),
     `CLIENT_URL` (your Vercel URL — can update this after step 3), `PUBLIC_URL` (this backend's
     own public URL, e.g. `https://freshmarket-api.onrender.com`, used to build uploaded image
     links).
  4. Deploy, then copy the public URL the host gives you.

  ### 3. Point Vercel at the deployed backend

  In the Vercel project's Environment Variables, set `VITE_API_URL` to
  `https://<your-backend-url>/api`, then redeploy the frontend.

  ### 4. Close the loop

  Go back to the backend host and update `CLIENT_URL` to the Vercel URL you now have, then
  redeploy the backend so CORS allows requests from it.

  ### Known limitation: uploaded product images

  The `/api/upload` endpoint currently saves files to local disk (`server/uploads/`). Most
  free-tier hosts (Render, Railway without a paid volume) wipe that disk on every redeploy/restart,
  so uploaded product images will eventually disappear. This is fine for local dev, but for
  production you'd want either a persistent volume or to switch storage to something like
  Cloudflare R2 / S3 — ask if you want that wired up.
