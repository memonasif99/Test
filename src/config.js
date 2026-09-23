'use strict';

module.exports = {
  storeName: { en: 'Doha Fresh Mart', ar: 'دوحة فريش مارت' },
  currency: 'QAR',
  // Qatar is UTC+3 all year (no daylight saving).
  utcOffsetHours: 3,
  // Minimum basket value (before delivery) to place an order.
  minOrderValue: 30,
  // Delivery is free when the basket value reaches this amount.
  freeDeliveryThreshold: 150,
  // Store delivery hours, local time (24h). Slots run from open to close.
  openHour: 7,
  closeHour: 23,
  slotLengthHours: 2,
  // A slot is bookable only if it starts at least this many minutes from now.
  slotLeadMinutes: 60,
  // How many days ahead (including today) customers can book.
  bookingDays: 3,
  // No deliveries during Friday (Jumu'ah) prayer, local time.
  fridayBreak: { start: 11, end: 13 },
  maxQuantityPerItem: 50,
  paymentMethods: [
    { id: 'cod', name: { en: 'Cash on delivery', ar: 'الدفع نقداً عند الاستلام' } },
    { id: 'card-on-delivery', name: { en: 'Card on delivery', ar: 'الدفع بالبطاقة عند الاستلام' } },
  ],
};
