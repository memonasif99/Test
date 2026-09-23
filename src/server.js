'use strict';

const path = require('path');
const crypto = require('crypto');
const { createApp } = require('./app');
const { Store } = require('./store');

const port = Number(process.env.PORT) || 3000;
const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'db.json');

let adminToken = process.env.ADMIN_TOKEN;
if (!adminToken) {
  adminToken = crypto.randomBytes(16).toString('hex');
  console.warn(`ADMIN_TOKEN not set — generated a temporary admin token for this run: ${adminToken}`);
}

const store = new Store(dbFile);
const app = createApp({ store, adminToken });

app.listen(port, () => {
  console.log(`Doha Fresh Mart running at http://localhost:${port}`);
  console.log(`Admin panel:               http://localhost:${port}/admin`);
});
