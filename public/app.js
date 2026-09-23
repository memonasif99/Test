(() => {
  'use strict';

  // ---------- i18n ----------
  const STRINGS = {
    en: {
      storeName: 'Doha Fresh Mart',
      searchPlaceholder: 'Search vegetables, fruits, essentials…',
      trackOrder: 'Track order',
      basket: 'Basket',
      yourBasket: 'Your basket',
      footer: 'Delivering fresh groceries across Doha, 7 am – 11 pm, every day.',
      banner: 'Delivering across Doha · Free delivery on orders over QAR {n}',
      all: 'All',
      add: 'Add',
      outOfStock: 'Out of stock',
      local: 'Local',
      origin: 'Origin: {o}',
      noResults: 'No products match your search.',
      emptyBasket: 'Your basket is empty. Add some fresh items!',
      subtotal: 'Subtotal',
      delivery: 'Delivery',
      free: 'Free',
      total: 'Total',
      checkout: 'Checkout',
      continueShopping: 'Continue shopping',
      addMoreForFree: 'Add QAR {n} more for free delivery',
      freeUnlocked: 'You have unlocked free delivery 🎉',
      minOrder: 'Minimum order is QAR {n}',
      deliveryCalcAtCheckout: 'Delivery fee depends on your area',
      contactDetails: 'Contact details',
      fullName: 'Full name',
      mobile: 'Mobile number',
      deliveryAddress: 'Delivery address (Qatar blue plate)',
      area: 'Area',
      chooseArea: 'Choose your area',
      zone: 'Zone no.',
      street: 'Street no.',
      building: 'Building no.',
      unit: 'Flat / villa no. (optional)',
      landmark: 'Landmark (optional)',
      plateNote: 'You can find Zone, Street and Building numbers on the blue plate outside your building.',
      notes: 'Notes for the driver (optional)',
      deliverySlot: 'Delivery slot',
      noSlots: 'No delivery slots are available right now. Please try again later.',
      payment: 'Payment',
      orderSummary: 'Order summary',
      placeOrder: 'Place order',
      placing: 'Placing order…',
      thankYou: 'Thank you, {name}!',
      orderPlaced: 'Your order has been placed.',
      orderNumber: 'Order number',
      keepNumber: 'Keep this number and your mobile number to track your order.',
      deliveryWindow: 'Delivery window',
      paymentMethod: 'Payment method',
      trackTitle: 'Track your order',
      orderNo: 'Order number',
      track: 'Track',
      status_placed: 'Order placed',
      status_confirmed: 'Confirmed',
      status_out_for_delivery: 'Out for delivery',
      status_delivered: 'Delivered',
      status_cancelled: 'Cancelled',
      today: 'Today',
      tomorrow: 'Tomorrow',
      added: 'Added {name}',
      fixFields: 'Please fix the highlighted fields.',
      networkError: 'Could not reach the store. Please check your connection.',
      items: 'Items',
      backToShop: 'Back to shop',
      fridayNote: 'No deliveries during Friday prayer (11 am – 1 pm).',
    },
    ar: {
      storeName: 'دوحة فريش مارت',
      searchPlaceholder: 'ابحث عن الخضروات والفواكه والمستلزمات…',
      trackOrder: 'تتبع الطلب',
      basket: 'السلة',
      yourBasket: 'سلة التسوق',
      footer: 'نوصل البقالة الطازجة في جميع أنحاء الدوحة، من ٧ صباحاً حتى ١١ مساءً يومياً.',
      banner: 'التوصيل في جميع أنحاء الدوحة · توصيل مجاني للطلبات فوق {n} ر.ق',
      all: 'الكل',
      add: 'أضف',
      outOfStock: 'نفدت الكمية',
      local: 'محلي',
      origin: 'المنشأ: {o}',
      noResults: 'لا توجد منتجات مطابقة لبحثك.',
      emptyBasket: 'سلتك فارغة. أضف بعض المنتجات الطازجة!',
      subtotal: 'المجموع الفرعي',
      delivery: 'التوصيل',
      free: 'مجاني',
      total: 'الإجمالي',
      checkout: 'إتمام الطلب',
      continueShopping: 'متابعة التسوق',
      addMoreForFree: 'أضف {n} ر.ق للحصول على توصيل مجاني',
      freeUnlocked: 'حصلت على توصيل مجاني 🎉',
      minOrder: 'الحد الأدنى للطلب {n} ر.ق',
      deliveryCalcAtCheckout: 'رسوم التوصيل تعتمد على منطقتك',
      contactDetails: 'بيانات التواصل',
      fullName: 'الاسم الكامل',
      mobile: 'رقم الجوال',
      deliveryAddress: 'عنوان التوصيل (اللوحة الزرقاء)',
      area: 'المنطقة',
      chooseArea: 'اختر منطقتك',
      zone: 'رقم المنطقة',
      street: 'رقم الشارع',
      building: 'رقم المبنى',
      unit: 'رقم الشقة / الفيلا (اختياري)',
      landmark: 'علامة مميزة (اختياري)',
      plateNote: 'تجد أرقام المنطقة والشارع والمبنى على اللوحة الزرقاء خارج المبنى.',
      notes: 'ملاحظات للسائق (اختياري)',
      deliverySlot: 'موعد التوصيل',
      noSlots: 'لا توجد مواعيد توصيل متاحة حالياً. يرجى المحاولة لاحقاً.',
      payment: 'الدفع',
      orderSummary: 'ملخص الطلب',
      placeOrder: 'تأكيد الطلب',
      placing: 'جارٍ إرسال الطلب…',
      thankYou: 'شكراً لك يا {name}!',
      orderPlaced: 'تم استلام طلبك.',
      orderNumber: 'رقم الطلب',
      keepNumber: 'احتفظ بهذا الرقم ورقم جوالك لتتبع طلبك.',
      deliveryWindow: 'موعد التوصيل',
      paymentMethod: 'طريقة الدفع',
      trackTitle: 'تتبع طلبك',
      orderNo: 'رقم الطلب',
      track: 'تتبع',
      status_placed: 'تم استلام الطلب',
      status_confirmed: 'تم التأكيد',
      status_out_for_delivery: 'في الطريق إليك',
      status_delivered: 'تم التوصيل',
      status_cancelled: 'ملغي',
      today: 'اليوم',
      tomorrow: 'غداً',
      added: 'تمت إضافة {name}',
      fixFields: 'يرجى تصحيح الحقول المحددة.',
      networkError: 'تعذر الاتصال بالمتجر. تحقق من اتصالك.',
      items: 'المنتجات',
      backToShop: 'العودة للمتجر',
      fridayNote: 'لا يوجد توصيل وقت صلاة الجمعة (١١ ص – ١ م).',
    },
  };

  const storage = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* storage unavailable — keep working in memory */
      }
    },
  };

  const state = {
    lang: storage.get('dfm.lang', 'en') === 'ar' ? 'ar' : 'en',
    cart: storage.get('dfm.cart', {}), // productId -> quantity
    config: null,
    categories: [],
    products: [],
    productIndex: new Map(),
    category: '',
    query: '',
    lastOrder: storage.get('dfm.lastOrder', null),
    checkoutForm: storage.get('dfm.checkout', {}),
  };

  function t(key, vars) {
    let s = (STRINGS[state.lang] && STRINGS[state.lang][key]) || STRINGS.en[key] || key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
    return s;
  }
  const L = (obj) => (obj ? obj[state.lang] || obj.en : '');
  const money = (n) => `${state.lang === 'ar' ? 'ر.ق' : 'QAR'} ${Number(n).toFixed(2)}`;

  // Tiny DOM helper: h('div', { class: 'x', onclick }, child1, 'text', ...)
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

  // Like el.replaceChildren(), but accepts nested arrays and skips null/false.
  function fill(el, ...children) {
    el.replaceChildren(...children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false));
  }

  async function api(path, options = {}) {
    const res = await fetch(path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || `HTTP ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  let toastTimer;
  function toast(message) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  // ---------- Cart ----------
  function saveCart() {
    storage.set('dfm.cart', state.cart);
    renderCartCount();
    renderCart();
  }

  function setQty(productId, qty) {
    const product = state.productIndex.get(productId);
    const max = product ? Math.min(product.stock, state.config.maxQuantityPerItem) : 0;
    const next = Math.max(0, Math.min(qty, max));
    if (next === 0) delete state.cart[productId];
    else state.cart[productId] = next;
    saveCart();
    refreshProductCard(productId);
  }

  function cartLines() {
    return Object.entries(state.cart)
      .map(([productId, quantity]) => ({ product: state.productIndex.get(productId), quantity }))
      .filter((l) => l.product);
  }

  function cartSubtotal() {
    // Sum in dirhams to avoid floating point drift.
    return cartLines().reduce((sum, l) => sum + Math.round(l.product.price * 100) * l.quantity, 0) / 100;
  }

  function renderCartCount() {
    const count = Object.values(state.cart).reduce((a, b) => a + b, 0);
    document.getElementById('cart-count').textContent = count;
  }

  function stepper(productId, qty) {
    return h(
      'div',
      { class: 'stepper' },
      h('button', { type: 'button', 'aria-label': '−', onclick: () => setQty(productId, qty - 1) }, '−'),
      h('span', { class: 'num' }, qty),
      h('button', { type: 'button', 'aria-label': '+', onclick: () => setQty(productId, qty + 1) }, '+'),
    );
  }

  function freeDeliveryHint(subtotal) {
    const threshold = state.config.freeDeliveryThreshold;
    const pct = Math.min(100, (subtotal / threshold) * 100);
    const remaining = Math.max(0, threshold - subtotal);
    return h(
      'div',
      { style: 'display:grid;gap:6px' },
      h('div', { class: 'progress' }, h('span', { style: `width:${pct}%` })),
      remaining > 0
        ? h('div', { class: 'hint' }, t('addMoreForFree', { n: remaining.toFixed(2) }))
        : h('div', { class: 'hint ok' }, t('freeUnlocked')),
    );
  }

  function renderCart() {
    const body = document.getElementById('cart-body');
    const foot = document.getElementById('cart-foot');
    body.replaceChildren();
    foot.replaceChildren();
    const lines = cartLines();

    if (!lines.length) {
      body.append(h('p', { class: 'empty' }, t('emptyBasket')));
      return;
    }

    for (const { product, quantity } of lines) {
      body.append(
        h(
          'div',
          { class: 'line' },
          h('div', { class: 'line-emoji', 'aria-hidden': 'true' }, product.emoji),
          h('div', {}, h('div', { class: 'line-name' }, L(product.name)), h('div', { class: 'line-sub' }, `${L(product.unit)} · ${money(product.price)}`)),
          h('div', { class: 'line-right' }, h('strong', { class: 'num' }, money(product.price * quantity)), stepper(product.id, quantity)),
        ),
      );
    }

    const subtotal = cartSubtotal();
    const belowMin = subtotal < state.config.minOrderValue;
    foot.append(
      h('div', { class: 'totals' }, h('div', { class: 'grand' }, h('span', {}, t('subtotal')), h('span', { class: 'num' }, money(subtotal)))),
      h('div', { class: 'hint' }, t('deliveryCalcAtCheckout')),
      freeDeliveryHint(subtotal),
      belowMin ? h('div', { class: 'hint warn' }, t('minOrder', { n: state.config.minOrderValue })) : null,
      h(
        'button',
        {
          type: 'button',
          class: 'btn btn-primary btn-block',
          disabled: belowMin,
          onclick: () => {
            closeCart();
            location.hash = '#/checkout';
          },
        },
        t('checkout'),
      ),
    );
  }

  const drawer = () => document.getElementById('cart-drawer');
  function openCart() {
    renderCart();
    drawer().classList.add('open');
    drawer().setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    drawer().classList.remove('open');
    drawer().setAttribute('aria-hidden', 'true');
  }

  // ---------- Views ----------
  const view = () => document.getElementById('view');

  function productCard(p) {
    const qty = state.cart[p.id] || 0;
    const action = !p.inStock
      ? h('span', { class: 'hint warn' }, t('outOfStock'))
      : qty > 0
        ? stepper(p.id, qty)
        : h(
            'button',
            {
              type: 'button',
              class: 'btn',
              onclick: () => {
                setQty(p.id, 1);
                toast(t('added', { name: L(p.name) }));
              },
            },
            t('add'),
          );

    return h(
      'article',
      { class: 'card', 'data-product': p.id },
      h('div', { class: 'card-emoji', 'aria-hidden': 'true' }, p.emoji),
      h('div', { class: 'card-name' }, L(p.name), p.origin === 'Qatar' ? h('span', { class: 'tag-local' }, t('local')) : null),
      h('div', { class: 'card-meta' }, L(p.unit)),
      p.origin && p.origin !== 'Qatar' ? h('div', { class: 'card-meta' }, t('origin', { o: p.origin })) : null,
      h('div', { class: 'card-foot' }, h('span', { class: 'price num' }, money(p.price)), action),
    );
  }

  function refreshProductCard(productId) {
    const card = document.querySelector(`[data-product="${CSS.escape(productId)}"]`);
    const product = state.productIndex.get(productId);
    if (card && product) card.replaceWith(productCard(product));
  }

  function visibleProducts() {
    const q = state.query.trim().toLowerCase();
    return state.products.filter((p) => {
      if (state.category && p.categoryId !== state.category) return false;
      if (q && !`${p.name.en} ${p.name.ar} ${p.origin}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function renderShop() {
    const chips = h(
      'div',
      { class: 'chips', role: 'toolbar' },
      h('button', { type: 'button', class: 'chip', 'aria-pressed': String(!state.category), onclick: () => selectCategory('') }, `🛒 ${t('all')}`),
      state.categories.map((c) =>
        h(
          'button',
          { type: 'button', class: 'chip', 'aria-pressed': String(state.category === c.id), onclick: () => selectCategory(c.id) },
          `${c.icon} ${L(c.name)}`,
        ),
      ),
    );

    const products = visibleProducts();
    const content = [];
    if (!products.length) {
      content.push(h('p', { class: 'empty' }, t('noResults')));
    } else if (state.category || state.query) {
      content.push(h('div', { class: 'grid' }, products.map(productCard)));
    } else {
      // Group by category on the home page.
      for (const c of state.categories) {
        const inCat = products.filter((p) => p.categoryId === c.id);
        if (!inCat.length) continue;
        content.push(h('h2', { class: 'section-title' }, `${c.icon} ${L(c.name)}`), h('div', { class: 'grid' }, inCat.map(productCard)));
      }
    }

    view().replaceChildren(chips, ...content);
  }

  function selectCategory(id) {
    state.category = id;
    renderShop();
  }

  // ----- Checkout -----
  let slotsCache = null;

  async function renderCheckout() {
    const lines = cartLines();
    if (!lines.length) {
      location.hash = '#/';
      return;
    }

    const form = state.checkoutForm;
    const selection = { slotId: form.slotId || '', paymentMethod: form.paymentMethod || 'cod', day: 0 };

    try {
      slotsCache = await api('/api/slots');
    } catch {
      slotsCache = [];
    }
    if (!slotsCache.some((d) => d.slots.some((s) => s.id === selection.slotId))) selection.slotId = '';

    const field = (name, label, input, cls = '') =>
      h('div', { class: `field ${cls}`, 'data-field': name }, h('label', { for: `f-${name}` }, label), input, h('div', { class: 'error' }));
    const input = (name, attrs = {}) =>
      h('input', { id: `f-${name}`, name, value: form[name] || '', oninput: persistForm, ...attrs });

    const areaSelect = h(
      'select',
      { id: 'f-areaId', name: 'areaId', onchange: () => { persistForm(); updateSummary(); } },
      h('option', { value: '' }, t('chooseArea')),
      state.config.areas.map((a) =>
        h('option', { value: a.id, selected: form.areaId === a.id }, `${L(a.name)} — ${money(a.fee)}`),
      ),
    );

    const formEl = h(
      'form',
      { id: 'checkout-form', novalidate: true, onsubmit: submitOrder },
      h(
        'section',
        { class: 'panel' },
        h('h2', {}, t('contactDetails')),
        h(
          'div',
          { class: 'fields' },
          field('name', t('fullName'), input('name', { autocomplete: 'name', required: true })),
          field(
            'phone',
            t('mobile'),
            h('div', { class: 'phone-wrap' }, h('span', {}, '+974'), input('phone', { type: 'tel', inputmode: 'numeric', autocomplete: 'tel-national', placeholder: '5512 3456', maxlength: '12', required: true })),
          ),
        ),
      ),
      h(
        'section',
        { class: 'panel' },
        h('h2', {}, t('deliveryAddress')),
        h(
          'div',
          { class: 'fields' },
          field('areaId', t('area'), areaSelect),
          field('zone', t('zone'), input('zone', { inputmode: 'numeric', maxlength: '2', required: true }), 'third'),
          field('street', t('street'), input('street', { inputmode: 'numeric', maxlength: '4', required: true }), 'third'),
          field('building', t('building'), input('building', { inputmode: 'numeric', maxlength: '4', required: true }), 'third'),
          h('p', { class: 'plate-note' }, t('plateNote')),
          field('unit', t('unit'), input('unit'), 'half'),
          field('landmark', t('landmark'), input('landmark'), 'half'),
          field('notes', t('notes'), h('textarea', { id: 'f-notes', name: 'notes', maxlength: '300', oninput: persistForm }, form.notes || '')),
        ),
      ),
      h('section', { class: 'panel', 'data-field': 'slotId' }, h('h2', {}, t('deliverySlot')), h('div', { id: 'slot-picker' }), h('div', { class: 'error hint warn' })),
      h(
        'section',
        { class: 'panel', 'data-field': 'paymentMethod' },
        h('h2', {}, t('payment')),
        h(
          'div',
          { class: 'radio-list' },
          state.config.paymentMethods.map((m) =>
            h(
              'label',
              { class: 'radio' },
              h('input', {
                type: 'radio',
                name: 'paymentMethod',
                value: m.id,
                checked: selection.paymentMethod === m.id,
                onchange: () => { selection.paymentMethod = m.id; persistForm(); },
              }),
              L(m.name),
            ),
          ),
        ),
        h('div', { class: 'error hint warn' }),
      ),
    );

    const summary = h('aside', { class: 'panel sticky', id: 'summary' });
    view().replaceChildren(h('div', { class: 'checkout' }, h('div', {}, formEl), summary));

    function persistForm() {
      const data = Object.fromEntries(new FormData(formEl).entries());
      state.checkoutForm = { ...data, slotId: selection.slotId, paymentMethod: selection.paymentMethod };
      storage.set('dfm.checkout', state.checkoutForm);
    }

    function renderSlots() {
      const picker = document.getElementById('slot-picker');
      picker.replaceChildren();
      if (!slotsCache.length) {
        picker.append(h('p', { class: 'hint warn' }, t('noSlots')));
        return;
      }
      if (selection.slotId) {
        const idx = slotsCache.findIndex((d) => d.slots.some((s) => s.id === selection.slotId));
        if (idx >= 0 && selection.day === 0 && idx !== 0 && !selection.dayTouched) selection.day = idx;
      }
      const todayStr = slotsCache[0] && slotsCache[0].date;
      const dayLabel = (d) => {
        const dt = new Date(`${d.date}T12:00:00Z`);
        const diff = Math.round((dt - new Date(`${todayStr}T12:00:00Z`)) / 86400000);
        const pretty = dt.toLocaleDateString(state.lang === 'ar' ? 'ar-QA' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
        const localToday = new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10);
        if (d.date === localToday) return `${t('today')} · ${pretty}`;
        if (diff === 1 && todayStr === localToday) return `${t('tomorrow')} · ${pretty}`;
        return pretty;
      };
      picker.append(
        h(
          'div',
          { class: 'day-tabs' },
          slotsCache.map((d, i) =>
            h('button', { type: 'button', class: 'chip', 'aria-pressed': String(i === selection.day), onclick: () => { selection.day = i; selection.dayTouched = true; renderSlots(); } }, dayLabel(d)),
          ),
        ),
      );
      const day = slotsCache[selection.day] || slotsCache[0];
      picker.append(
        h(
          'div',
          { class: 'slots' },
          day.slots.map((s) =>
            h('button', { type: 'button', class: 'slot', 'aria-pressed': String(s.id === selection.slotId), onclick: () => { selection.slotId = s.id; persistForm(); renderSlots(); } }, `${s.start} – ${s.end}`),
          ),
        ),
      );
      if (day.dayOfWeek === 5) picker.append(h('p', { class: 'hint' }, t('fridayNote')));
    }

    async function updateSummary() {
      const areaId = areaSelect.value;
      const items = cartLines().map((l) => ({ productId: l.product.id, quantity: l.quantity }));
      let q;
      try {
        q = await api('/api/quote', { method: 'POST', body: JSON.stringify({ items, areaId }) });
      } catch {
        return;
      }
      fill(
        summary,
        h('h2', {}, t('orderSummary')),
        q.items.map((i) =>
          h('div', { class: 'line' }, h('div', { class: 'line-emoji', 'aria-hidden': 'true' }, i.emoji), h('div', {}, h('div', { class: 'line-name' }, L(i.name)), h('div', { class: 'line-sub' }, `${i.quantity} × ${L(i.unit)}`)), h('strong', { class: 'num' }, money(i.lineTotal))),
        ),
        h(
          'div',
          { class: 'totals', style: 'margin-top:10px' },
          h('div', {}, h('span', {}, t('subtotal')), h('span', { class: 'num' }, money(q.subtotal))),
          h('div', {}, h('span', {}, t('delivery')), h('span', { class: 'num' }, !areaId && !q.freeDelivery ? '—' : q.deliveryFee === 0 ? t('free') : money(q.deliveryFee))),
          h('div', { class: 'grand' }, h('span', {}, t('total')), h('span', { class: 'num' }, money(q.total))),
        ),
        h('div', { style: 'margin:10px 0' }, freeDeliveryHint(q.subtotal)),
        q.errors.length ? h('div', { class: 'alert' }, q.errors.join(' ')) : null,
        h('div', { id: 'submit-error' }),
        h('button', { type: 'submit', form: 'checkout-form', class: 'btn btn-primary btn-block', id: 'place-order', disabled: q.errors.length > 0 }, t('placeOrder')),
        h('a', { href: '#/', class: 'hint', style: 'display:block;text-align:center;margin-top:10px' }, t('continueShopping')),
      );
    }

    async function submitOrder(e) {
      e.preventDefault();
      persistForm();
      const data = Object.fromEntries(new FormData(formEl).entries());
      for (const el of document.querySelectorAll('[data-field]')) {
        el.classList.remove('invalid');
        const err = el.querySelector('.error');
        if (err) err.textContent = '';
      }
      const btn = document.getElementById('place-order');
      const errorBox = document.getElementById('submit-error');
      errorBox.replaceChildren();
      btn.disabled = true;
      btn.textContent = t('placing');
      try {
        const order = await api('/api/orders', {
          method: 'POST',
          body: JSON.stringify({
            items: cartLines().map((l) => ({ productId: l.product.id, quantity: l.quantity })),
            customer: data,
            slotId: selection.slotId,
            paymentMethod: selection.paymentMethod,
          }),
        });
        state.cart = {};
        saveCart();
        const lastOrder = { id: order.id, phone: data.phone };
        state.lastOrder = lastOrder;
        storage.set('dfm.lastOrder', lastOrder);
        // Keep contact + address for next time, but not the slot.
        state.checkoutForm = { ...state.checkoutForm, slotId: '', notes: '' };
        storage.set('dfm.checkout', state.checkoutForm);
        await loadCatalog();
        location.hash = `#/order/${order.id}`;
      } catch (err) {
        btn.disabled = false;
        btn.textContent = t('placeOrder');
        if (err.status === 422 && err.data && err.data.fields) {
          for (const [name, message] of Object.entries(err.data.fields)) {
            const el = document.querySelector(`[data-field="${CSS.escape(name)}"]`);
            if (el) {
              el.classList.add('invalid');
              const box = el.querySelector('.error');
              if (box) box.textContent = message;
            }
          }
          errorBox.append(h('div', { class: 'alert', style: 'margin-bottom:10px' }, err.data.fields.items || t('fixFields')));
          const first = document.querySelector('.invalid');
          if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (err.data.fields.slotId) {
            slotsCache = await api('/api/slots').catch(() => []);
            selection.slotId = '';
            renderSlots();
          }
        } else {
          errorBox.append(h('div', { class: 'alert', style: 'margin-bottom:10px' }, err.status ? err.message : t('networkError')));
        }
      }
    }

    renderSlots();
    updateSummary();
  }

  // ----- Order status (confirmation + tracking) -----
  const FLOW = ['placed', 'confirmed', 'out_for_delivery', 'delivered'];

  function orderDetails(order, { fresh }) {
    const reached = new Set(order.history.map((h0) => h0.status));
    const statuses = order.status === 'cancelled' ? ['placed', 'cancelled'] : FLOW;
    const payment = state.config.paymentMethods.find((m) => m.id === order.paymentMethod);
    const slotDate = new Date(`${order.slot.date}T12:00:00Z`).toLocaleDateString(state.lang === 'ar' ? 'ar-QA' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

    return h(
      'div',
      { class: 'confirm' },
      h(
        'div',
        { class: 'panel' },
        h(
          'div',
          { class: 'confirm-hero' },
          h('div', { class: 'big', 'aria-hidden': 'true' }, order.status === 'cancelled' ? '❌' : fresh ? '✅' : '📦'),
          fresh ? h('h1', {}, t('thankYou', { name: order.customer.name.split(' ')[0] })) : null,
          fresh ? h('p', {}, t('orderPlaced')) : null,
          h('div', { class: 'hint' }, t('orderNumber')),
          h('div', { class: 'order-id' }, order.id),
          fresh ? h('p', { class: 'hint' }, t('keepNumber')) : null,
        ),
        h(
          'ol',
          { class: 'timeline' },
          statuses.map((s) => h('li', { class: `${reached.has(s) ? 'done' : ''} ${s === 'cancelled' ? 'cancelled' : ''}` }, h('span', { class: 'dot' }), t(`status_${s}`))),
        ),
        h(
          'div',
          { class: 'totals' },
          h('div', {}, h('span', {}, t('deliveryWindow')), h('span', {}, `${slotDate}, `, h('span', { class: 'num' }, `${order.slot.start}–${order.slot.end}`))),
          h('div', {}, h('span', {}, t('area')), h('span', {}, L(order.area.name))),
          h('div', {}, h('span', {}, t('paymentMethod')), h('span', {}, payment ? L(payment.name) : order.paymentMethod)),
        ),
      ),
      h(
        'div',
        { class: 'panel' },
        h('h2', {}, t('items')),
        order.items.map((i) =>
          h('div', { class: 'line' }, h('div', { class: 'line-emoji', 'aria-hidden': 'true' }, i.emoji), h('div', {}, h('div', { class: 'line-name' }, L(i.name)), h('div', { class: 'line-sub' }, `${i.quantity} × ${L(i.unit)}`)), h('strong', { class: 'num' }, money(i.lineTotal))),
        ),
        h(
          'div',
          { class: 'totals', style: 'margin-top:10px' },
          h('div', {}, h('span', {}, t('subtotal')), h('span', { class: 'num' }, money(order.subtotal))),
          h('div', {}, h('span', {}, t('delivery')), h('span', { class: 'num' }, order.deliveryFee === 0 ? t('free') : money(order.deliveryFee))),
          h('div', { class: 'grand' }, h('span', {}, t('total')), h('span', { class: 'num' }, money(order.total))),
        ),
      ),
      h('p', { style: 'text-align:center' }, h('a', { href: '#/', class: 'btn btn-ghost', style: 'text-decoration:none;display:inline-block' }, t('backToShop'))),
    );
  }

  async function renderOrder(id) {
    const last = state.lastOrder;
    if (!last || last.id !== id) {
      location.hash = `#/track`;
      return;
    }
    try {
      const order = await api(`/api/orders/${encodeURIComponent(id)}?phone=${encodeURIComponent(last.phone)}`);
      view().replaceChildren(orderDetails(order, { fresh: true }));
    } catch (err) {
      view().replaceChildren(h('p', { class: 'empty' }, err.message));
    }
  }

  function renderTrack() {
    const last = state.lastOrder || {};
    const result = h('div', { style: 'margin-top:16px' });
    const orderInput = h('input', { id: 't-order', value: last.id || '', placeholder: 'DFM-XXXXXX', required: true, style: 'direction:ltr' });
    const phoneInput = h('input', { id: 't-phone', type: 'tel', inputmode: 'numeric', value: last.phone || '', placeholder: '5512 3456', required: true });

    const form = h(
      'form',
      {
        class: 'panel confirm',
        onsubmit: async (e) => {
          e.preventDefault();
          result.replaceChildren();
          try {
            const order = await api(`/api/orders/${encodeURIComponent(orderInput.value.trim())}?phone=${encodeURIComponent(phoneInput.value)}`);
            result.append(orderDetails(order, { fresh: false }));
          } catch (err) {
            result.append(h('div', { class: 'alert confirm' }, err.status ? err.message : t('networkError')));
          }
        },
      },
      h('h2', {}, t('trackTitle')),
      h(
        'div',
        { class: 'fields' },
        h('div', { class: 'field half' }, h('label', { for: 't-order' }, t('orderNo')), orderInput),
        h('div', { class: 'field half' }, h('label', { for: 't-phone' }, t('mobile')), h('div', { class: 'phone-wrap' }, h('span', {}, '+974'), phoneInput)),
        h('div', { class: 'field' }, h('button', { type: 'submit', class: 'btn btn-primary btn-block' }, t('track'))),
      ),
    );
    view().replaceChildren(form, result);
    if (last.id && last.phone) form.requestSubmit();
  }

  // ---------- Router / chrome ----------
  function route() {
    const hash = location.hash || '#/';
    closeCart();
    if (hash.startsWith('#/checkout')) return renderCheckout();
    if (hash.startsWith('#/order/')) return renderOrder(decodeURIComponent(hash.slice('#/order/'.length)));
    if (hash.startsWith('#/track')) return renderTrack();
    return renderShop();
  }

  function applyLanguage() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('storeName');
    for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
    for (const el of document.querySelectorAll('[data-i18n-placeholder]')) el.placeholder = t(el.dataset.i18nPlaceholder);
    document.getElementById('lang-toggle').textContent = state.lang === 'ar' ? 'English' : 'عربي';
    if (state.config) document.getElementById('banner').textContent = t('banner', { n: state.config.freeDeliveryThreshold });
  }

  async function loadCatalog() {
    const [categories, products] = await Promise.all([api('/api/categories'), api('/api/products')]);
    state.categories = categories;
    state.products = products;
    state.productIndex = new Map(products.map((p) => [p.id, p]));
    // Drop basket entries for products that no longer exist.
    for (const id of Object.keys(state.cart)) if (!state.productIndex.has(id)) delete state.cart[id];
    renderCartCount();
  }

  async function init() {
    document.getElementById('cart-open').addEventListener('click', openCart);
    for (const el of document.querySelectorAll('[data-close]')) el.addEventListener('click', closeCart);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });
    document.getElementById('lang-toggle').addEventListener('click', () => {
      state.lang = state.lang === 'ar' ? 'en' : 'ar';
      storage.set('dfm.lang', state.lang);
      applyLanguage();
      renderCart();
      route();
    });
    const search = document.getElementById('search');
    document.getElementById('search-form').addEventListener('submit', (e) => e.preventDefault());
    search.addEventListener('input', () => {
      state.query = search.value;
      if (location.hash && location.hash !== '#/') location.hash = '#/';
      else renderShop();
    });
    window.addEventListener('hashchange', route);

    applyLanguage();
    try {
      state.config = await api('/api/config');
      await loadCatalog();
    } catch {
      view().replaceChildren(h('p', { class: 'empty' }, t('networkError')));
      return;
    }
    applyLanguage();
    route();
  }

  init();
})();
