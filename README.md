# Doha Fresh Mart 🧺

An online general store for **Doha, Qatar**: fresh vegetables, fruits and everyday household products, delivered to your door.

The storefront works in **English and Arabic** (with right-to-left layout). Prices are in **Qatari Riyal (QAR)** and addresses use Qatar's **blue plate** system (Zone / Street / Building numbers).

## Features

**Customers**
- About 50 products in 8 categories: vegetables, fruits, dairy & eggs, bakery, rice & pantry, water & beverages, household & cleaning, and personal care
- Search in English or Arabic, filter by category, and see locally grown Qatari produce marked "Local"
- Basket saved in the browser, with a progress bar toward free delivery
- Checkout details:
  - Qatar mobile number check (`+974`, 8 digits starting with 3, 5, 6 or 7)
  - 20 Doha delivery areas, each with its own fee (from The Pearl and West Bay out to Lusail and Al Wakra)
  - 2-hour delivery slots in Doha time (UTC+3), between 7 am and 11 pm, bookable up to 3 days ahead
  - No slots during Friday Jumu'ah prayer (11:00–13:00)
  - Cash on delivery or card on delivery
- Order confirmation and tracking by order number plus mobile number

**Store staff** (`/admin`)
- Order dashboard showing new orders, orders to dispatch, orders out for delivery and today's sales
- Order status flow: Placed → Confirmed → Out for delivery → Delivered, or Cancelled (cancelling puts the stock back)
- Edit prices and stock, hide products, and add new products
- Warnings for low or zero stock

**Business rules** (in `src/config.js`)

| Setting | Default |
|---|---|
| Minimum order | QAR 30 |
| Free delivery from | QAR 150 |
| Delivery fee | QAR 10–20 depending on area (`src/data/areas.js`) |
| Delivery hours | 07:00–23:00, 2-hour slots, at least 60 min lead time |
| Max quantity per item | 50 |

Prices, stock and totals are always worked out on the server from the catalogue. Prices sent by the browser are ignored.

## Getting started

Requires Node.js 18+.

```bash
npm install
ADMIN_TOKEN=choose-a-secret npm start
```

- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin (log in with your `ADMIN_TOKEN`)

If you don't set `ADMIN_TOKEN`, the server makes up a temporary one and prints it in the console.

| Env var | Purpose | Default |
|---|---|---|
| `PORT` | HTTP port | `3000` |
| `ADMIN_TOKEN` | Bearer token for `/api/admin/*` | random per run |
| `DB_FILE` | JSON database path | `data/db.json` |

Data is stored in a JSON file, which is filled with the starting catalogue on first run. Run `npm run reset-db` to go back to the starting catalogue.

## Tests

```bash
npm test
```

The tests cover phone and address validation, delivery slots (timezone, lead time, Friday prayer break), pricing (merging duplicate lines, exact money maths, free delivery, stock and minimum order), and the full order flow through the API including admin actions.

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/config` | Store settings, delivery areas, payment methods |
| GET | `/api/categories` | Categories |
| GET | `/api/products?category=&q=` | Active products |
| GET | `/api/slots` | Available delivery slots |
| POST | `/api/quote` | `{ items, areaId }` → priced basket |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/:id?phone=` | Track an order |
| GET/PATCH | `/api/admin/orders[/:id]` | List orders / change status *(admin)* |
| GET/POST/PATCH | `/api/admin/products[/:id]` | Manage catalogue *(admin)* |

## Project layout

```
src/
  server.js          entry point
  app.js             Express routes
  store.js           JSON-file store
  config.js          business rules
  data/catalog.js    starting products (EN/AR)
  data/areas.js      Doha delivery areas & fees
  lib/               pricing, slots, validation
public/              storefront (index.html, app.js) and admin (admin.html, admin.js)
test/                node:test suites
```

## Next steps for production

- Online card payments (for example QPay/NAPS or a card gateway) — right now payment is taken on delivery
- A real database (PostgreSQL or SQLite) instead of the JSON file
- SMS or WhatsApp notifications when an order's status changes
- Real product photos instead of emoji
