'use strict';

const path = require('path');
const crypto = require('crypto');
const express = require('express');
const config = require('./config');
const { deliveryAreas } = require('./data/areas');
const { quote } = require('./lib/pricing');
const { listSlots, findSlot } = require('./lib/slots');
const { validateCustomer, normalizeQatarMobile, cleanText } = require('./lib/validation');

const ORDER_STATUSES = ['placed', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'];
const ALLOWED_TRANSITIONS = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered'],
  delivered: [],
  cancelled: [],
};

function publicProduct(p) {
  const { active, ...rest } = p;
  return { ...rest, inStock: p.stock > 0 };
}

function publicOrder(o) {
  return {
    id: o.id,
    status: o.status,
    createdAt: o.createdAt,
    items: o.items,
    subtotal: o.subtotal,
    deliveryFee: o.deliveryFee,
    total: o.total,
    currency: o.currency,
    slot: o.slot,
    paymentMethod: o.paymentMethod,
    customer: { name: o.customer.name },
    area: o.area,
    history: o.history,
  };
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/**
 * Creates the Express application.
 * @param {object} opts
 * @param {import('./store').Store} opts.store
 * @param {string} opts.adminToken  Bearer token required for /api/admin routes.
 * @param {() => Date} [opts.now]   Clock, injectable for tests.
 */
function createApp({ store, adminToken, now = () => new Date() }) {
  const app = express();
  const areaIds = deliveryAreas.map((a) => a.id);
  const findArea = (id) => deliveryAreas.find((a) => a.id === id) || null;

  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));
  app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'same-origin');
    next();
  });

  // ---------- Storefront API ----------

  app.get('/api/config', (req, res) => {
    res.json({
      storeName: config.storeName,
      currency: config.currency,
      minOrderValue: config.minOrderValue,
      freeDeliveryThreshold: config.freeDeliveryThreshold,
      maxQuantityPerItem: config.maxQuantityPerItem,
      paymentMethods: config.paymentMethods,
      areas: deliveryAreas,
    });
  });

  app.get('/api/categories', (req, res) => {
    res.json(store.categories);
  });

  app.get('/api/products', (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : '';
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    const results = store.products.filter((p) => {
      if (!p.active) return false;
      if (category && p.categoryId !== category) return false;
      if (q && !`${p.name.en} ${p.name.ar} ${p.origin}`.toLowerCase().includes(q)) return false;
      return true;
    });
    res.json(results.map(publicProduct));
  });

  app.get('/api/slots', (req, res) => {
    res.json(listSlots(now()));
  });

  app.post('/api/quote', (req, res) => {
    const area = findArea(req.body && req.body.areaId);
    const result = quote(req.body && req.body.items, { products: store.products, area });
    res.json(result);
  });

  app.post('/api/orders', (req, res) => {
    const body = req.body || {};
    const { value: customer, errors } = validateCustomer(body.customer, areaIds);

    const slot = findSlot(body.slotId, now());
    if (!slot) errors.slotId = 'Please choose an available delivery slot.';

    const payment = config.paymentMethods.find((m) => m.id === body.paymentMethod);
    if (!payment) errors.paymentMethod = 'Please choose a payment method.';

    const area = findArea(customer.address.areaId);
    const priced = quote(body.items, { products: store.products, area });
    if (priced.errors.length) errors.items = priced.errors.join(' ');

    if (Object.keys(errors).length) {
      return res.status(422).json({ error: 'Please fix the highlighted fields.', fields: errors });
    }

    const createdAt = now().toISOString();
    const order = store.placeOrder({
      id: store.newOrderId(),
      status: 'placed',
      createdAt,
      customer: { name: customer.name, phone: customer.phone },
      address: customer.address,
      area: { id: area.id, name: area.name },
      notes: customer.notes,
      slot,
      paymentMethod: payment.id,
      items: priced.items,
      subtotal: priced.subtotal,
      deliveryFee: priced.deliveryFee,
      total: priced.total,
      currency: priced.currency,
      history: [{ status: 'placed', at: createdAt }],
    });

    res.status(201).json(publicOrder(order));
  });

  // Order tracking needs the phone number used at checkout, so order ids alone
  // cannot be used to look up someone else's order.
  app.get('/api/orders/:id', (req, res) => {
    const order = store.getOrder(String(req.params.id).toUpperCase());
    const phone = normalizeQatarMobile(String(req.query.phone || ''));
    if (!order || !phone || order.customer.phone !== phone) {
      return res.status(404).json({ error: 'Order not found. Check the order number and phone.' });
    }
    res.json(publicOrder(order));
  });

  // ---------- Admin API ----------

  const admin = express.Router();
  admin.use((req, res, next) => {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!adminToken || !token || !safeEqual(token, adminToken)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  });

  admin.get('/orders', (req, res) => {
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const orders = store.orders
      .filter((o) => !status || o.status === status)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(orders);
  });

  admin.patch('/orders/:id', (req, res) => {
    const order = store.getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const next = req.body && req.body.status;
    if (!ORDER_STATUSES.includes(next) || !ALLOWED_TRANSITIONS[order.status].includes(next)) {
      return res.status(409).json({ error: `Cannot change status from ${order.status} to ${next}.` });
    }
    if (next === 'cancelled') store.restock(order);
    order.status = next;
    order.history.push({ status: next, at: now().toISOString() });
    store.save();
    res.json(order);
  });

  admin.get('/products', (req, res) => {
    res.json(store.products);
  });

  admin.patch('/products/:id', (req, res) => {
    const product = store.getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const b = req.body || {};
    const errors = {};
    if (b.price !== undefined) {
      if (typeof b.price !== 'number' || !(b.price > 0) || b.price > 10000) errors.price = 'Invalid price';
    }
    if (b.stock !== undefined) {
      if (!Number.isInteger(b.stock) || b.stock < 0 || b.stock > 100000) errors.stock = 'Invalid stock';
    }
    if (b.active !== undefined && typeof b.active !== 'boolean') errors.active = 'Invalid flag';
    if (Object.keys(errors).length) return res.status(422).json({ error: 'Invalid product update', fields: errors });

    if (b.price !== undefined) product.price = Math.round(b.price * 100) / 100;
    if (b.stock !== undefined) product.stock = b.stock;
    if (b.active !== undefined) product.active = b.active;
    store.save();
    res.json(product);
  });

  admin.post('/products', (req, res) => {
    const b = req.body || {};
    const nameEn = cleanText(b.nameEn, 80);
    const nameAr = cleanText(b.nameAr, 80);
    const unitEn = cleanText(b.unitEn, 40);
    const errors = {};
    if (!nameEn) errors.nameEn = 'English name is required';
    if (!unitEn) errors.unitEn = 'Unit is required';
    if (!store.categories.some((c) => c.id === b.categoryId)) errors.categoryId = 'Unknown category';
    if (typeof b.price !== 'number' || !(b.price > 0) || b.price > 10000) errors.price = 'Invalid price';
    if (!Number.isInteger(b.stock) || b.stock < 0) errors.stock = 'Invalid stock';
    if (Object.keys(errors).length) return res.status(422).json({ error: 'Invalid product', fields: errors });

    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item';
    let id = `${b.categoryId.slice(0, 3)}-${slug}`;
    for (let i = 2; store.getProduct(id); i += 1) id = `${b.categoryId.slice(0, 3)}-${slug}-${i}`;

    const product = store.addProduct({
      id,
      categoryId: b.categoryId,
      emoji: cleanText(b.emoji, 8) || '🛒',
      name: { en: nameEn, ar: nameAr || nameEn },
      unit: { en: unitEn, ar: cleanText(b.unitAr, 40) || unitEn },
      price: Math.round(b.price * 100) / 100,
      stock: b.stock,
      origin: cleanText(b.origin, 40),
      active: true,
    });
    res.status(201).json(product);
  });

  app.use('/api/admin', admin);

  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

  // ---------- Static frontend ----------
  app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'] }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });

  return app;
}

module.exports = { createApp, ORDER_STATUSES };
