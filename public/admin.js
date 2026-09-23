(() => {
  'use strict';

  const root = document.getElementById('admin');
  const STATUS_LABEL = {
    placed: 'Placed',
    confirmed: 'Confirmed',
    out_for_delivery: 'Out for delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  const NEXT_ACTIONS = {
    placed: [['confirmed', 'Confirm'], ['cancelled', 'Cancel']],
    confirmed: [['out_for_delivery', 'Dispatch'], ['cancelled', 'Cancel']],
    out_for_delivery: [['delivered', 'Mark delivered']],
    delivered: [],
    cancelled: [],
  };

  let token = sessionGet('dfm.adminToken');
  let tab = 'orders';
  let orderFilter = '';
  let categories = [];

  function sessionGet(key) {
    try {
      return sessionStorage.getItem(key) || '';
    } catch {
      return '';
    }
  }
  function sessionSet(key, value) {
    try {
      if (value) sessionStorage.setItem(key, value);
      else sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }

  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v === null || v === undefined) continue;
      if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'class') el.className = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  let toastTimer;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
  }

  async function api(path, options = {}) {
    const res = await fetch(path, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      logout();
      throw new Error('Session expired — please log in again.');
    }
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  const money = (n) => `QAR ${Number(n).toFixed(2)}`;
  const fmtTime = (iso) => new Date(iso).toLocaleString('en-GB', { timeZone: 'Asia/Qatar', dateStyle: 'medium', timeStyle: 'short' });

  function logout() {
    token = '';
    sessionSet('dfm.adminToken', '');
    render();
  }

  function renderLogin(error) {
    const input = h('input', { type: 'password', id: 'token', autocomplete: 'current-password', required: true });
    root.replaceChildren(
      h(
        'form',
        {
          class: 'panel confirm',
          onsubmit: async (e) => {
            e.preventDefault();
            token = input.value.trim();
            try {
              await api('/api/admin/orders');
              sessionSet('dfm.adminToken', token);
              render();
            } catch {
              renderLogin('Invalid admin token.');
            }
          },
        },
        h('h2', {}, 'Admin login'),
        h('div', { class: 'fields' }, h('div', { class: 'field' }, h('label', { for: 'token' }, 'Admin token'), input)),
        error ? h('div', { class: 'alert', style: 'margin-top:10px' }, error) : null,
        h('p', { class: 'muted' }, 'The token is set with the ADMIN_TOKEN environment variable when starting the server.'),
        h('button', { type: 'submit', class: 'btn btn-primary btn-block' }, 'Log in'),
      ),
    );
  }

  async function renderOrders(container) {
    const orders = await api(`/api/admin/orders${orderFilter ? `?status=${orderFilter}` : ''}`);
    const all = orderFilter ? await api('/api/admin/orders') : orders;
    const count = (s) => all.filter((o) => o.status === s).length;
    const today = new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10);
    const revenueToday = all
      .filter((o) => o.status !== 'cancelled' && new Date(Date.parse(o.createdAt) + 3 * 3600000).toISOString().slice(0, 10) === today)
      .reduce((s, o) => s + Math.round(o.total * 100), 0) / 100;

    container.append(
      h(
        'div',
        { class: 'stats' },
        h('div', { class: 'stat' }, h('b', {}, count('placed')), 'New orders'),
        h('div', { class: 'stat' }, h('b', {}, count('confirmed')), 'To dispatch'),
        h('div', { class: 'stat' }, h('b', {}, count('out_for_delivery')), 'Out for delivery'),
        h('div', { class: 'stat' }, h('b', {}, money(revenueToday)), 'Sales today (Doha time)'),
      ),
      h(
        'div',
        { class: 'chips' },
        [['', 'All'], ...Object.entries(STATUS_LABEL)].map(([s, label]) =>
          h('button', { type: 'button', class: 'chip', 'aria-pressed': String(orderFilter === s), onclick: () => { orderFilter = s; render(); } }, label),
        ),
      ),
    );

    if (!orders.length) {
      container.append(h('p', { class: 'empty' }, 'No orders yet.'));
      return;
    }

    container.append(
      h(
        'div',
        { class: 'table-wrap' },
        h(
          'table',
          {},
          h('thead', {}, h('tr', {}, ['Order', 'Customer', 'Address', 'Slot', 'Items', 'Total', 'Status', ''].map((c) => h('th', {}, c)))),
          h(
            'tbody',
            {},
            orders.map((o) =>
              h(
                'tr',
                {},
                h('td', {}, h('strong', {}, o.id), h('div', { class: 'muted' }, fmtTime(o.createdAt))),
                h('td', {}, o.customer.name, h('div', {}, h('a', { href: `tel:${o.customer.phone}` }, o.customer.phone))),
                h(
                  'td',
                  {},
                  o.area.name.en,
                  h('div', { class: 'muted' }, `Zone ${o.address.zone}, St ${o.address.street}, Bldg ${o.address.building}${o.address.unit ? `, ${o.address.unit}` : ''}`),
                  o.address.landmark ? h('div', { class: 'muted' }, o.address.landmark) : null,
                  o.notes ? h('div', { class: 'muted' }, `📝 ${o.notes}`) : null,
                ),
                h('td', {}, o.slot.date, h('div', { class: 'muted' }, `${o.slot.start}–${o.slot.end}`)),
                h('td', {}, o.items.map((i) => h('div', {}, `${i.quantity} × ${i.name.en}`))),
                h('td', {}, money(o.total), h('div', { class: 'muted' }, o.paymentMethod === 'cod' ? 'Cash' : 'Card on delivery')),
                h('td', {}, h('span', { class: `status ${o.status}` }, STATUS_LABEL[o.status])),
                h(
                  'td',
                  {},
                  h(
                    'div',
                    { class: 'actions' },
                    NEXT_ACTIONS[o.status].map(([next, label]) =>
                      h(
                        'button',
                        {
                          type: 'button',
                          class: `btn ${next === 'cancelled' ? 'btn-ghost' : ''}`,
                          onclick: async () => {
                            if (next === 'cancelled' && !confirm(`Cancel order ${o.id}? Stock will be returned.`)) return;
                            try {
                              await api(`/api/admin/orders/${encodeURIComponent(o.id)}`, { method: 'PATCH', body: JSON.stringify({ status: next }) });
                              toast(`${o.id} → ${STATUS_LABEL[next]}`);
                              render();
                            } catch (err) {
                              toast(err.message);
                            }
                          },
                        },
                        label,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  async function renderProducts(container) {
    const products = await api('/api/admin/products');
    categories = categories.length ? categories : await api('/api/categories');
    const catName = (id) => (categories.find((c) => c.id === id) || { name: { en: id } }).name.en;

    async function save(p, patch) {
      try {
        await api(`/api/admin/products/${encodeURIComponent(p.id)}`, { method: 'PATCH', body: JSON.stringify(patch) });
        toast(`Saved ${p.name.en}`);
        render();
      } catch (err) {
        toast(err.message);
      }
    }

    container.append(newProductForm());
    container.append(
      h(
        'div',
        { class: 'table-wrap' },
        h(
          'table',
          {},
          h('thead', {}, h('tr', {}, ['', 'Product', 'Category', 'Price (QAR)', 'Stock', 'Visible', ''].map((c) => h('th', {}, c)))),
          h(
            'tbody',
            {},
            products.map((p) => {
              const price = h('input', { type: 'number', step: '0.25', min: '0.25', value: p.price });
              const stock = h('input', { type: 'number', step: '1', min: '0', value: p.stock });
              const active = h('input', { type: 'checkbox', checked: p.active });
              return h(
                'tr',
                {},
                h('td', { style: 'font-size:1.4rem' }, p.emoji),
                h('td', {}, p.name.en, h('div', { class: 'muted', dir: 'rtl' }, p.name.ar), h('div', { class: 'muted' }, `${p.unit.en} · ${p.origin || ''}`)),
                h('td', {}, catName(p.categoryId)),
                h('td', {}, price),
                h('td', {}, stock, p.stock <= 10 ? h('div', { class: 'low' }, p.stock === 0 ? 'Out of stock' : 'Low stock') : null),
                h('td', {}, active),
                h(
                  'td',
                  {},
                  h(
                    'button',
                    {
                      type: 'button',
                      class: 'btn',
                      onclick: () => save(p, { price: Number(price.value), stock: Number(stock.value), active: active.checked }),
                    },
                    'Save',
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }

  function newProductForm() {
    const f = (name, label, attrs = {}, cls = 'third') =>
      h('div', { class: `field ${cls}` }, h('label', { for: `np-${name}` }, label), h('input', { id: `np-${name}`, name, ...attrs }));
    const form = h(
      'form',
      {
        class: 'panel',
        style: 'margin-bottom:16px',
        onsubmit: async (e) => {
          e.preventDefault();
          const d = Object.fromEntries(new FormData(form).entries());
          try {
            await api('/api/admin/products', {
              method: 'POST',
              body: JSON.stringify({ ...d, price: Number(d.price), stock: Number(d.stock) }),
            });
            toast(`Added ${d.nameEn}`);
            render();
          } catch (err) {
            toast(err.message);
          }
        },
      },
      h('h2', {}, 'Add product'),
      h(
        'div',
        { class: 'fields' },
        f('nameEn', 'Name (English)', { required: true }),
        f('nameAr', 'Name (Arabic)', { dir: 'rtl' }),
        h(
          'div',
          { class: 'field third' },
          h('label', { for: 'np-categoryId' }, 'Category'),
          h('select', { id: 'np-categoryId', name: 'categoryId', required: true }, categories.map((c) => h('option', { value: c.id }, c.name.en))),
        ),
        f('unitEn', 'Unit (English)', { required: true, placeholder: '1 kg' }),
        f('unitAr', 'Unit (Arabic)', { dir: 'rtl', placeholder: '١ كجم' }),
        f('origin', 'Origin', { placeholder: 'Qatar' }),
        f('price', 'Price (QAR)', { type: 'number', step: '0.25', min: '0.25', required: true }),
        f('stock', 'Stock', { type: 'number', step: '1', min: '0', required: true }),
        f('emoji', 'Emoji', { maxlength: '8', placeholder: '🥑' }),
        h('div', { class: 'field' }, h('button', { type: 'submit', class: 'btn btn-primary' }, 'Add product')),
      ),
    );
    return form;
  }

  async function render() {
    document.getElementById('logout').hidden = !token;
    if (!token) return renderLogin();

    const container = h('div');
    root.replaceChildren(
      h(
        'div',
        { class: 'admin-tabs' },
        h('button', { type: 'button', class: 'chip', 'aria-pressed': String(tab === 'orders'), onclick: () => { tab = 'orders'; render(); } }, '📦 Orders'),
        h('button', { type: 'button', class: 'chip', 'aria-pressed': String(tab === 'products'), onclick: () => { tab = 'products'; render(); } }, '🥬 Products & stock'),
        h('button', { type: 'button', class: 'chip', onclick: () => render() }, '↻ Refresh'),
      ),
      container,
    );
    try {
      if (tab === 'orders') await renderOrders(container);
      else await renderProducts(container);
    } catch (err) {
      if (token) container.append(h('div', { class: 'alert' }, err.message));
    }
  }

  document.getElementById('logout').addEventListener('click', logout);
  render();
})();
