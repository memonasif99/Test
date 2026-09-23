'use strict';

// Qatar mobile numbers are 8 digits starting with 3, 5, 6 or 7, optionally
// prefixed with the +974 / 00974 country code.
function normalizeQatarMobile(input) {
  if (typeof input !== 'string') return null;
  let digits = input.replace(/[\s\-().]/g, '');
  if (digits.startsWith('+974')) digits = digits.slice(4);
  else if (digits.startsWith('00974')) digits = digits.slice(5);
  else if (digits.length === 11 && digits.startsWith('974')) digits = digits.slice(3);
  if (!/^[3567]\d{7}$/.test(digits)) return null;
  return `+974${digits}`;
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

// Qatar addresses follow the blue-plate system: Zone, Street and Building numbers.
function parsePositiveInt(value, max) {
  const s = String(value ?? '').trim();
  if (!/^\d{1,4}$/.test(s)) return null;
  const n = Number(s);
  return n >= 1 && n <= max ? n : null;
}

/**
 * Validates the customer + address part of a checkout payload.
 * Returns { value, errors } where errors maps field name -> message.
 */
function validateCustomer(body, areaIds) {
  const errors = {};
  const b = body || {};

  const name = cleanText(b.name, 80);
  if (name.length < 2) errors.name = 'Please enter your full name.';

  const phone = normalizeQatarMobile(b.phone);
  if (!phone) errors.phone = 'Enter a valid Qatar mobile number (8 digits, e.g. 5512 3456).';

  const areaId = typeof b.areaId === 'string' ? b.areaId : '';
  if (!areaIds.includes(areaId)) errors.areaId = 'Please choose a delivery area.';

  const zone = parsePositiveInt(b.zone, 99);
  if (zone === null) errors.zone = 'Zone number must be between 1 and 99.';

  const street = parsePositiveInt(b.street, 9999);
  if (street === null) errors.street = 'Enter a valid street number.';

  const building = parsePositiveInt(b.building, 9999);
  if (building === null) errors.building = 'Enter a valid building number.';

  const value = {
    name,
    phone,
    address: {
      areaId,
      zone,
      street,
      building,
      unit: cleanText(b.unit, 40),
      landmark: cleanText(b.landmark, 120),
    },
    notes: cleanText(b.notes, 300),
  };

  return { value, errors };
}

module.exports = { normalizeQatarMobile, validateCustomer, cleanText };
