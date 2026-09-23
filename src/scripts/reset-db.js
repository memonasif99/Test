'use strict';

// Deletes the JSON database so the store is re-seeded on next start.
const fs = require('fs');
const path = require('path');

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', '..', 'data', 'db.json');
fs.rmSync(dbFile, { force: true });
console.log(`Removed ${dbFile}. The catalogue will be re-seeded on next start.`);
