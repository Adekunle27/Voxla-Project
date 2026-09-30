# Voxla — Full-Stack MVP

A working, verified full-stack build of Voxla: Nigeria's construction materials
price intelligence marketplace with an embedded VoxlaPay checkout, matching the
brand guidelines and price guide you supplied.

## Stack

**Backend** — `server/`
- Express + TypeScript
- SQLite via Drizzle ORM + better-sqlite3 (zero external services — the whole
  API runs from a single local file, `voxla.db`)
- JWT auth (register/login) with two account types — Buyer and Supplier —
  bcrypt password hashing
- **Supplier accounts**: registering as a supplier creates a linked
  `Supplier` profile (starts unverified — see "Next steps"). Suppliers get
  a dashboard to post, edit, and unlist their own material listings
- **Image uploads**: suppliers attach a real product photo per listing
  (multipart upload, stored as a base64 data URI — see the note on this below)
- Real order creation: prices are always re-resolved server-side from the
  database, never trusted from the client — this applies identically to
  seeded catalog items and supplier-posted listings

> Note: I originally scaffolded this with Prisma to match your IHOPS stack,
> but Prisma downloads its query engine binaries from `binaries.prisma.sh` at
> install time, which was unreachable in my sandboxed build environment. I
> switched to Drizzle + better-sqlite3 so I could actually install, seed, and
> verify the whole app end-to-end before handing it to you (all of this was
> tested — see "What I verified" below). Prisma would work fine on your own
> machine if you'd rather swap back to it later; the route/schema logic
* translates directly.

**Frontend** — `client/`
- React + TypeScript + Vite
- Tailwind, configured with your exact brand tokens (Trust Blue `#1E3A8A`,
  Energy Orange `#F97316`, Montserrat/Inter)
- React Router: Home, Price Index (materials), Supplier Directory, Login,
  Register (with Buyer/Supplier toggle), My Orders, **Supplier Dashboard**
- Axios client with JWT auto-attached from `localStorage`
- Cart persisted in `localStorage`, checked out against the real backend
- Every material shows a **real photo** when the supplier uploaded one, and
  falls back to a category icon only for photo-less seeded catalog items

## How supplier accounts work

1. On the Register page, choosing "Supplier" asks for a business name and
   city, and creates a linked `Supplier` profile alongside the login.
2. New supplier accounts start **unverified** (no "Verified" badge) — I left
   verification as a manual step rather than auto-verifying anyone who signs
   up, since the badge is supposed to mean something. There's no admin UI
   for this yet; flip `verified` to `1` on their row in `suppliers` directly,
   or that's a natural next feature to add (see "Next steps").
3. From `/supplier/dashboard`, a supplier posts a material: category, name,
   spec, unit, price, stock, delivery time, and an optional photo. This
   creates both a catalog entry and a price listing in one step, so it
   immediately appears in the buyer-facing Price Index and can be ordered
   like any other listing.
4. "Unlist" is a soft delete (sets `active = false`) rather than a hard
   delete — this avoids breaking foreign-key references from past orders
   that already point at that listing. "Relist" reverses it.

**On image storage**: uploaded photos are stored as base64 data URIs
directly in the `materials` table (via `multer` in-memory upload → base64 →
saved). This is deliberately simple and keeps the whole app to one SQLite
file with zero cloud dependencies, which is why I could fully verify it in
my sandboxed environment. It doesn't scale well — every listing's photo
bloats the database row, and there's a 2MB per-image limit enforced at
upload time. Before this goes further than an MVP demo, swap
`POST /api/uploads/image` to upload to S3/Cloudinary/Supabase Storage
instead and store just the resulting URL — the rest of the app doesn't
care where `imageUrl` points, so that's a contained change.

## What I verified (all of this actually ran, not just compiled)

- `npm install` clean on both server and client
- `tsc` type-checks clean on both
- `vite build` produces a working production bundle
- Seed script populates 32 materials, 11 categories, 71 unique suppliers
- Live smoke test against the running API: register → login → search
  materials → compare suppliers → place a real order → order persisted with
  a generated `VXL-######` reference and correct total
- Frontend served and reachable, hitting the same live API
- **Full supplier flow, exercised in a real browser (Playwright), not just
  via API**: registered a supplier account → posted a material with an
  uploaded photo → registered a separate buyer account → confirmed the
  buyer sees the listing with the real photo on the Price Index → opened
  Compare Suppliers and saw the photo again in the modal header → added to
  cart → completed the VoxlaPay checkout UI (card fields, Pay button) → got
  a real order confirmation with a generated reference number, for an item
  that only exists because a supplier posted it minutes earlier

## Running it yourself

**1. Backend**
```bash
cd server
npm install
npm run seed      # populates voxla.db with materials, suppliers, prices
npm run dev        # starts the API on http://localhost:4000
```

**2. Frontend** (in a second terminal)
```bash
cd client
npm install
npm run dev         # starts the app on http://localhost:5173
```

Open http://localhost:5173 — register an account, browse the Price Index,
compare suppliers on any material, add to cart, and check out through the
VoxlaPay flow (fake payment, real order saved to your account).

## API reference

| Method | Route                          | Auth | Description                          |
|--------|--------------------------------|------|---------------------------------------|
| GET    | `/api/health`                  | —    | Liveness check                        |
| POST   | `/api/auth/register`           | —    | Create account, returns JWT           |
| POST   | `/api/auth/login`               | —    | Returns JWT                           |
| GET    | `/api/auth/me`                  | Yes  | Current user                          |
| GET    | `/api/materials?query=&category=` | —  | Search/filter materials               |
| GET    | `/api/materials/categories/all` | —    | List categories                       |
| GET    | `/api/materials/:id/suppliers`  | —    | Compare suppliers for one material    |
| GET    | `/api/suppliers`                | —    | Supplier directory                    |
| POST   | `/api/orders`                   | Yes  | Place an order (VoxlaPay simulation)  |
| GET    | `/api/orders`                   | Yes  | Your order history                    |
| GET    | `/api/supplier/me`               | Supplier | Your supplier profile             |
| GET    | `/api/supplier/listings`         | Supplier | Your posted materials             |
| POST   | `/api/supplier/listings`         | Supplier | Post a new material listing       |
| PATCH  | `/api/supplier/listings/:id`     | Supplier | Edit price/stock/photo/unlist     |
| POST   | `/api/uploads/image`             | Yes  | Upload a listing photo (multipart, field `image`), returns `{ url }` |

## Next steps I'd suggest

1. **Supplier verification admin view** — new supplier accounts start
   unverified by design; there's no UI yet to review and flip that badge on.
2. **Real payments** — swap the simulated VoxlaPay step for Paystack or
   Flutterwave under the hood (or your own rails later).
3. **Deploy** — Railway/Render for the API + a persistent volume for SQLite
   (or move to Postgres), Vercel/Netlify for the client.
4. **Price history table** — currently trend/change is static seed data;
   a real `price_history` table would let trends compute from actual data
   over time, matching the "PRICE DROP / PRICE RISE" badges in your brand kit.
5. **Real product photos** — every material currently shows a category icon
   placeholder (`client/src/components/MaterialVisual.tsx`), not a real
   photo — there was no product photography to work from. Once suppliers
   are onboarded, add an `imageUrl` column to the `materials`/`suppliers`
   tables and swap the icon block in `MaterialVisual.tsx` for an `<img>`.

## Troubleshooting: homepage shows no products

If the homepage/Price Index looks empty, it's almost always one of:
- **The API isn't running** — start it with `npm run dev` in `server/`.
- **The database isn't seeded** — run `npm run seed` in `server/` (this is
  a fresh SQLite file each time; it's not seeded automatically).
- **`client/.env` doesn't point at the right API** — check `VITE_API_URL`
  matches where the server is actually running (default `http://localhost:4000/api`).
