'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');
const { Store } = require('../src/store');

const ADMIN = 'test-admin-token';
// Wednesday 2026-09-23, 09:00 in Doha.
const NOW = new Date('2026-09-23T06:00:00Z');
const SLOT = '2026-09-23@13';

async function startServer() {
  const store = new Store();
  const app = createApp({ store, adminToken: ADMIN, now: () => NOW });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, path, body, headers = {}) => {
    const res = await fetch(base + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: res.status, body: await res.json() };
  };
  const adminCall = (method, path, body) => call(method, path, body, { Authorization: `Bearer ${ADMIN}` });
  return { store, server, call, adminCall };
}

const customer = {
  name: 'Ahmed Al-Thani',
  phone: '5512 3456',
  areaId: 'the-pearl',
  zone: '66',
  street: '350',
  building: '12',
  unit: 'Apt 1204',
};

test('storefront API', async (t) => {
  const { store, server, call, adminCall } = await startServer();
  t.after(() => server.close());

  await t.test('lists config, categories and products', async () => {
    const cfg = await call('GET', '/api/config');
    assert.equal(cfg.body.currency, 'QAR');
    assert.ok(cfg.body.areas.some((a) => a.id === 'the-pearl'));

    const cats = await call('GET', '/api/categories');
    assert.ok(cats.body.length >= 6);

    const veg = await call('GET', '/api/products?category=vegetables');
    assert.ok(veg.body.length > 0);
    assert.ok(veg.body.every((p) => p.categoryId === 'vegetables'));

    const search = await call('GET', `/api/products?q=${encodeURIComponent('طماطم')}`);
    assert.deepEqual(search.body.map((p) => p.id), ['veg-tomato']);
  });

  await t.test('rejects an invalid order with field errors', async () => {
    const res = await call('POST', '/api/orders', {
      items: [{ productId: 'veg-tomato', quantity: 1 }],
      customer: { ...customer, phone: '123' },
      slotId: '2026-09-23@07',
      paymentMethod: 'bitcoin',
    });
    assert.equal(res.status, 422);
    assert.deepEqual(Object.keys(res.body.fields).sort(), ['items', 'paymentMethod', 'phone', 'slotId']);
  });

  let orderId;
  await t.test('places an order, deducting stock and charging area fee', async () => {
    const before = store.getProduct('fru-mango').stock;
    const res = await call('POST', '/api/orders', {
      items: [
        { productId: 'fru-mango', quantity: 2 },
        { productId: 'dai-eggs', quantity: 1 },
      ],
      customer,
      slotId: SLOT,
      paymentMethod: 'cod',
    });
    assert.equal(res.status, 201);
    assert.match(res.body.id, /^DFM-[0-9A-F]{6}$/);
    assert.equal(res.body.subtotal, 43);
    assert.equal(res.body.deliveryFee, 15);
    assert.equal(res.body.total, 58);
    assert.equal(res.body.customer.phone, undefined, 'phone is not echoed back publicly');
    assert.equal(store.getProduct('fru-mango').stock, before - 2);
    orderId = res.body.id;
  });

  await t.test('tracking requires the matching phone number', async () => {
    assert.equal((await call('GET', `/api/orders/${orderId}?phone=33123456`)).status, 404);
    const ok = await call('GET', `/api/orders/${orderId.toLowerCase()}?phone=%2B97455123456`);
    assert.equal(ok.status, 200);
    assert.equal(ok.body.status, 'placed');
  });

  await t.test('admin routes require the token', async () => {
    assert.equal((await call('GET', '/api/admin/orders')).status, 401);
    assert.equal((await call('GET', '/api/admin/orders', undefined, { Authorization: 'Bearer wrong' })).status, 401);
    const res = await adminCall('GET', '/api/admin/orders');
    assert.equal(res.status, 200);
    assert.equal(res.body[0].customer.phone, '+97455123456');
  });

  await t.test('admin moves orders through allowed statuses only', async () => {
    assert.equal((await adminCall('PATCH', `/api/admin/orders/${orderId}`, { status: 'delivered' })).status, 409);
    assert.equal((await adminCall('PATCH', `/api/admin/orders/${orderId}`, { status: 'confirmed' })).status, 200);
    const tracked = await call('GET', `/api/orders/${orderId}?phone=55123456`);
    assert.deepEqual(tracked.body.history.map((h) => h.status), ['placed', 'confirmed']);
  });

  await t.test('cancelling an order returns stock', async () => {
    const before = store.getProduct('fru-mango').stock;
    const res = await adminCall('PATCH', `/api/admin/orders/${orderId}`, { status: 'cancelled' });
    assert.equal(res.status, 200);
    assert.equal(store.getProduct('fru-mango').stock, before + 2);
    assert.equal((await adminCall('PATCH', `/api/admin/orders/${orderId}`, { status: 'confirmed' })).status, 409);
  });

  await t.test('admin can update and add products', async () => {
    const upd = await adminCall('PATCH', '/api/admin/products/veg-tomato', { price: 3.999, stock: 0 });
    assert.equal(upd.status, 200);
    assert.equal(upd.body.price, 4);
    const listed = await call('GET', '/api/products?q=tomato');
    assert.equal(listed.body[0].inStock, false);

    assert.equal((await adminCall('PATCH', '/api/admin/products/veg-tomato', { price: -1 })).status, 422);

    await adminCall('PATCH', '/api/admin/products/veg-mint', { active: false });
    assert.equal((await call('GET', '/api/products?q=mint')).body.length, 0);

    const add = await adminCall('POST', '/api/admin/products', {
      nameEn: 'Avocado', nameAr: 'أفوكادو', unitEn: '2 pcs', categoryId: 'fruits', price: 9.5, stock: 20, emoji: '🥑', origin: 'Kenya',
    });
    assert.equal(add.status, 201);
    assert.equal(add.body.id, 'fru-avocado');
    assert.equal((await call('GET', '/api/products?q=avocado')).body.length, 1);
  });

  await t.test('unknown API routes return JSON 404, bad JSON returns 400', async () => {
    assert.equal((await call('GET', '/api/nope')).status, 404);
    const res = await fetch(`http://127.0.0.1:${server.address().port}/api/quote`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad',
    });
    assert.equal(res.status, 400);
  });
});

test('store persists to disk and reloads', async () => {
  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dfm-'));
  const file = path.join(dir, 'db.json');
  const a = new Store(file);
  a.getProduct('veg-tomato').stock = 7;
  a.save();
  const b = new Store(file);
  assert.equal(b.getProduct('veg-tomato').stock, 7);
  fs.rmSync(dir, { recursive: true, force: true });
});
