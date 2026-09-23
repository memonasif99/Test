'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeQatarMobile, validateCustomer } = require('../src/lib/validation');
const { listSlots, findSlot } = require('../src/lib/slots');
const { quote } = require('../src/lib/pricing');
const { products } = require('../src/data/catalog');

test('normalizeQatarMobile accepts local and international formats', () => {
  assert.equal(normalizeQatarMobile('5512 3456'), '+97455123456');
  assert.equal(normalizeQatarMobile('+974 3312-3456'), '+97433123456');
  assert.equal(normalizeQatarMobile('0097466123456'), '+97466123456');
  assert.equal(normalizeQatarMobile('97477123456'), '+97477123456');
});

test('normalizeQatarMobile rejects landlines and bad input', () => {
  assert.equal(normalizeQatarMobile('44123456'), null); // landline
  assert.equal(normalizeQatarMobile('5512345'), null); // too short
  assert.equal(normalizeQatarMobile('+971501234567'), null); // UAE
  assert.equal(normalizeQatarMobile(undefined), null);
});

test('validateCustomer reports each invalid field', () => {
  const { errors } = validateCustomer({ name: 'A', phone: '123', areaId: 'nowhere', zone: '120', street: 'x', building: '' }, ['al-sadd']);
  assert.deepEqual(Object.keys(errors).sort(), ['areaId', 'building', 'name', 'phone', 'street', 'zone']);

  const ok = validateCustomer({ name: ' Fatima  Al Kuwari ', phone: '55123456', areaId: 'al-sadd', zone: '38', street: '231', building: '12' }, ['al-sadd']);
  assert.deepEqual(ok.errors, {});
  assert.equal(ok.value.name, 'Fatima Al Kuwari');
  assert.equal(ok.value.address.zone, 38);
});

test('slots respect lead time, opening hours and Qatar timezone', () => {
  // 2026-09-23 is a Wednesday. 10:30 Doha time == 07:30 UTC.
  const days = listSlots(new Date('2026-09-23T07:30:00Z'));
  assert.equal(days.length, 3);
  assert.equal(days[0].date, '2026-09-23');
  // Earliest start must be >= 11:30 local, so first slot is 13:00.
  assert.equal(days[0].slots[0].start, '13:00');
  assert.equal(days[0].slots.at(-1).end, '23:00');
  assert.equal(days[1].slots[0].start, '07:00');
});

test('late-night requests roll over to the next Doha day', () => {
  // 22:30 UTC on the 23rd is 01:30 on the 24th in Doha.
  const days = listSlots(new Date('2026-09-23T22:30:00Z'));
  assert.equal(days[0].date, '2026-09-24');
  assert.equal(days[0].slots[0].start, '07:00');
});

test('no slots overlap Friday prayer time', () => {
  // 2026-09-25 is a Friday.
  const days = listSlots(new Date('2026-09-24T21:00:00Z'));
  const friday = days.find((d) => d.date === '2026-09-25');
  assert.equal(friday.dayOfWeek, 5);
  const starts = friday.slots.map((s) => s.start);
  assert.ok(!starts.includes('11:00'));
  assert.ok(starts.includes('07:00') && starts.includes('13:00'));
  assert.equal(findSlot('2026-09-25@11', new Date('2026-09-24T21:00:00Z')), null);
});

test('quote prices from catalogue, merges duplicates and applies delivery rules', () => {
  const area = { id: 'x', fee: 15 };
  const q = quote(
    [
      { productId: 'pan-basmati', quantity: 1 },
      { productId: 'pan-basmati', quantity: 1, price: 0.01 },
    ],
    { products, area },
  );
  assert.deepEqual(q.errors, []);
  assert.equal(q.items.length, 1);
  assert.equal(q.items[0].quantity, 2);
  assert.equal(q.subtotal, 64);
  assert.equal(q.deliveryFee, 15);
  assert.equal(q.total, 79);

  const big = quote([{ productId: 'fru-dates', quantity: 6 }], { products, area });
  assert.equal(big.subtotal, 150);
  assert.equal(big.deliveryFee, 0);
  assert.equal(big.freeDelivery, true);
});

test('quote avoids floating point drift', () => {
  const q = quote([{ productId: 'pan-chickpeas', quantity: 3 }, { productId: 'veg-potato', quantity: 7 }], { products, area: null });
  assert.equal(q.subtotal, 32.5);
});

test('quote enforces minimum order, stock and quantity limits', () => {
  assert.match(quote([{ productId: 'bak-arabic-bread', quantity: 1 }], { products }).errors[0], /Minimum order/);
  assert.match(quote([{ productId: 'pc-sunscreen', quantity: 26 }], { products }).errors[0], /left in stock/);
  assert.match(quote([{ productId: 'pc-sunscreen', quantity: 0 }], { products }).errors[0], /Invalid quantity/);
  assert.match(quote([{ productId: 'nope', quantity: 1 }], { products }).errors[0], /not available/);
  assert.match(quote([], { products }).errors[0], /empty/);
});
