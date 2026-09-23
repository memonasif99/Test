'use strict';

const config = require('../config');

// All money maths is done in dirhams (1 QAR = 100 dirhams) to avoid floating
// point drift, then converted back to riyals for display.
const toDirhams = (qar) => Math.round(qar * 100);
const toRiyals = (dirhams) => dirhams / 100;

/**
 * Builds a priced quote for a list of { productId, quantity } lines.
 * Prices always come from the catalogue, never from the client.
 */
function quote(lines, { products, area }, cfg = config) {
  const errors = [];
  const items = [];
  const seen = new Map();

  if (!Array.isArray(lines) || lines.length === 0) {
    return { errors: ['Your basket is empty.'], items: [] };
  }

  for (const line of lines) {
    const quantity = Number(line && line.quantity);
    const productId = line && line.productId;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > cfg.maxQuantityPerItem) {
      errors.push(`Invalid quantity for ${productId}.`);
      continue;
    }
    seen.set(productId, (seen.get(productId) || 0) + quantity);
  }

  let subtotal = 0;
  for (const [productId, quantity] of seen) {
    const product = products.find((p) => p.id === productId && p.active);
    if (!product) {
      errors.push(`Product ${productId} is not available.`);
      continue;
    }
    if (quantity > product.stock) {
      errors.push(`Only ${product.stock} of "${product.name.en}" left in stock.`);
      continue;
    }
    const lineTotal = toDirhams(product.price) * quantity;
    subtotal += lineTotal;
    items.push({
      productId,
      name: product.name,
      unit: product.unit,
      emoji: product.emoji,
      unitPrice: product.price,
      quantity,
      lineTotal: toRiyals(lineTotal),
    });
  }

  const freeDelivery = subtotal >= toDirhams(cfg.freeDeliveryThreshold);
  const deliveryFee = area && !freeDelivery ? toDirhams(area.fee) : 0;

  if (items.length && subtotal < toDirhams(cfg.minOrderValue)) {
    errors.push(`Minimum order is ${cfg.minOrderValue} ${cfg.currency}.`);
  }

  return {
    errors,
    items,
    subtotal: toRiyals(subtotal),
    deliveryFee: toRiyals(deliveryFee),
    freeDelivery,
    total: toRiyals(subtotal + deliveryFee),
    currency: cfg.currency,
  };
}

module.exports = { quote, toDirhams, toRiyals };
