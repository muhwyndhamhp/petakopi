# Kopi Map (Peta Kopi)

## What is this repo?
This is a repo that host my code for my own coffee review blog (https://kopimap.mwyndham.dev). All code is open source and can be used as a reference for developing fullstack app using Hono + React in Cloudflare Worker.

## Tech Stack
- SST
- Cloudflare
  - Worker
  - R2 With Custom Domain
  - Image Transformation
  - KV
- Turso DB (Remote SQLite DB)
- Hono for Backend
  - RPC style usage for complete type safety with SPA client
  - Valibot for schema validation
  - Kysely for Query Builder
- Open Auth JS for Admin CRUD Auth (Self-hosted at Cloudflare Worker as well)
- React with Vite
- Tanstack Router
- SWR
- MapLibre for Map
- Stadia Map for Custom vector-based Tiles.
- Sono Font
- Tailwind CSS
- Daisy UI