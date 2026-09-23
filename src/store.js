'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const catalog = require('./data/catalog');

function seedState() {
  return {
    categories: structuredClone(catalog.categories),
    products: structuredClone(catalog.products),
    orders: [],
  };
}

/**
 * A small JSON-file backed store. State is kept in memory and every mutation
 * is flushed to disk atomically (write temp file, then rename). Pass no file
 * path to get a purely in-memory store (used by tests).
 */
class Store {
  constructor(filePath) {
    this.filePath = filePath || null;
    this.state = this.load();
  }

  load() {
    if (this.filePath && fs.existsSync(this.filePath)) {
      return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    }
    const state = seedState();
    this.state = state;
    this.save();
    return state;
  }

  save() {
    if (!this.filePath) return;
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.state, null, 2));
    fs.renameSync(tmp, this.filePath);
  }

  get categories() {
    return this.state.categories;
  }

  get products() {
    return this.state.products;
  }

  get orders() {
    return this.state.orders;
  }

  getProduct(id) {
    return this.state.products.find((p) => p.id === id) || null;
  }

  getOrder(id) {
    return this.state.orders.find((o) => o.id === id) || null;
  }

  newOrderId() {
    let id;
    do {
      id = `DFM-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    } while (this.getOrder(id));
    return id;
  }

  // Deducts stock for every item and records the order in one step.
  placeOrder(order) {
    for (const item of order.items) {
      this.getProduct(item.productId).stock -= item.quantity;
    }
    this.state.orders.push(order);
    this.save();
    return order;
  }

  restock(order) {
    for (const item of order.items) {
      const product = this.getProduct(item.productId);
      if (product) product.stock += item.quantity;
    }
  }

  addProduct(product) {
    this.state.products.push(product);
    this.save();
    return product;
  }
}

module.exports = { Store, seedState };
