'use strict';

const config = require('../config');

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function pad(n) {
  return String(n).padStart(2, '0');
}

// Returns the Qatar-local calendar date (YYYY-MM-DD) for a UTC timestamp.
function localDateString(utcMs, offsetHours = config.utcOffsetHours) {
  const d = new Date(utcMs + offsetHours * HOUR_MS);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

// Converts a Qatar-local date + hour into a UTC timestamp.
function localToUtcMs(dateString, hour, offsetHours = config.utcOffsetHours) {
  const [y, m, d] = dateString.split('-').map(Number);
  return Date.UTC(y, m - 1, d, hour) - offsetHours * HOUR_MS;
}

function overlapsFridayBreak(dayOfWeek, startHour, endHour, cfg) {
  if (dayOfWeek !== 5 || !cfg.fridayBreak) return false;
  return startHour < cfg.fridayBreak.end && endHour > cfg.fridayBreak.start;
}

/**
 * Lists bookable delivery slots from `now` (a Date) for the configured number
 * of days, in Qatar local time. Each slot id has the form "YYYY-MM-DD@HH".
 */
function listSlots(now = new Date(), cfg = config) {
  const nowMs = now.getTime();
  const earliestStart = nowMs + cfg.slotLeadMinutes * 60 * 1000;
  const today = localDateString(nowMs, cfg.utcOffsetHours);
  const days = [];

  for (let i = 0; i < cfg.bookingDays; i += 1) {
    const date = localDateString(localToUtcMs(today, 12, cfg.utcOffsetHours) + i * DAY_MS, cfg.utcOffsetHours);
    const dayOfWeek = new Date(`${date}T00:00:00Z`).getUTCDay();
    const slots = [];

    for (let h = cfg.openHour; h + cfg.slotLengthHours <= cfg.closeHour; h += cfg.slotLengthHours) {
      const end = h + cfg.slotLengthHours;
      if (overlapsFridayBreak(dayOfWeek, h, end, cfg)) continue;
      if (localToUtcMs(date, h, cfg.utcOffsetHours) < earliestStart) continue;
      slots.push({ id: `${date}@${pad(h)}`, date, start: `${pad(h)}:00`, end: `${pad(end)}:00` });
    }

    if (slots.length) days.push({ date, dayOfWeek, slots });
  }

  return days;
}

function findSlot(slotId, now = new Date(), cfg = config) {
  for (const day of listSlots(now, cfg)) {
    const slot = day.slots.find((s) => s.id === slotId);
    if (slot) return slot;
  }
  return null;
}

module.exports = { listSlots, findSlot, localDateString, localToUtcMs };
