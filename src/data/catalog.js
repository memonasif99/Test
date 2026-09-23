'use strict';

// Initial catalog. Prices are in Qatari Riyal (QAR). Each product has an
// English and Arabic name so the storefront can be shown in either language.

const categories = [
  { id: 'vegetables', name: { en: 'Vegetables', ar: 'خضروات' }, icon: '🥬' },
  { id: 'fruits', name: { en: 'Fruits', ar: 'فواكه' }, icon: '🍎' },
  { id: 'dairy', name: { en: 'Dairy & Eggs', ar: 'ألبان وبيض' }, icon: '🥛' },
  { id: 'bakery', name: { en: 'Bakery', ar: 'مخبوزات' }, icon: '🍞' },
  { id: 'pantry', name: { en: 'Rice, Grains & Pantry', ar: 'أرز وحبوب ومؤن' }, icon: '🍚' },
  { id: 'beverages', name: { en: 'Water & Beverages', ar: 'مياه ومشروبات' }, icon: '🧃' },
  { id: 'household', name: { en: 'Household & Cleaning', ar: 'منظفات ومستلزمات المنزل' }, icon: '🧽' },
  { id: 'personal-care', name: { en: 'Personal Care', ar: 'العناية الشخصية' }, icon: '🧴' },
];

// [id, category, emoji, nameEn, nameAr, unitEn, unitAr, price, stock, origin]
const rows = [
  ['veg-tomato', 'vegetables', '🍅', 'Tomatoes', 'طماطم', '1 kg', '١ كجم', 4.5, 120, 'Qatar'],
  ['veg-cucumber', 'vegetables', '🥒', 'Cucumbers', 'خيار', '1 kg', '١ كجم', 4.0, 100, 'Qatar'],
  ['veg-potato', 'vegetables', '🥔', 'Potatoes', 'بطاطس', '1 kg', '١ كجم', 3.25, 150, 'Saudi Arabia'],
  ['veg-onion-red', 'vegetables', '🧅', 'Red Onions', 'بصل أحمر', '1 kg', '١ كجم', 3.0, 150, 'India'],
  ['veg-carrot', 'vegetables', '🥕', 'Carrots', 'جزر', '1 kg', '١ كجم', 4.25, 80, 'Australia'],
  ['veg-capsicum', 'vegetables', '🫑', 'Green Capsicum', 'فلفل رومي أخضر', '500 g', '٥٠٠ جم', 5.5, 60, 'Qatar'],
  ['veg-lettuce', 'vegetables', '🥬', 'Iceberg Lettuce', 'خس آيسبرغ', '1 piece', '١ حبة', 5.0, 50, 'Qatar'],
  ['veg-garlic', 'vegetables', '🧄', 'Garlic', 'ثوم', '250 g', '٢٥٠ جم', 3.5, 70, 'China'],
  ['veg-eggplant', 'vegetables', '🍆', 'Eggplant', 'باذنجان', '1 kg', '١ كجم', 5.75, 60, 'Qatar'],
  ['veg-coriander', 'vegetables', '🌿', 'Fresh Coriander', 'كزبرة', '1 bunch', '١ ربطة', 1.5, 90, 'Qatar'],
  ['veg-mint', 'vegetables', '🌱', 'Fresh Mint', 'نعناع', '1 bunch', '١ ربطة', 1.5, 90, 'Qatar'],
  ['veg-lemon', 'vegetables', '🍋', 'Lemons', 'ليمون', '500 g', '٥٠٠ جم', 4.0, 100, 'Egypt'],

  ['fru-banana', 'fruits', '🍌', 'Bananas', 'موز', '1 kg', '١ كجم', 6.5, 120, 'Philippines'],
  ['fru-apple-red', 'fruits', '🍎', 'Red Apples', 'تفاح أحمر', '1 kg', '١ كجم', 8.75, 90, 'USA'],
  ['fru-orange', 'fruits', '🍊', 'Oranges', 'برتقال', '1 kg', '١ كجم', 6.0, 100, 'Egypt'],
  ['fru-mango', 'fruits', '🥭', 'Mangoes', 'مانجو', '1 kg', '١ كجم', 12.5, 60, 'India'],
  ['fru-grapes', 'fruits', '🍇', 'Green Grapes', 'عنب أخضر', '500 g', '٥٠٠ جم', 9.0, 50, 'Lebanon'],
  ['fru-watermelon', 'fruits', '🍉', 'Watermelon', 'بطيخ', '1 piece (~4 kg)', '١ حبة (~٤ كجم)', 14.0, 30, 'Iran'],
  ['fru-dates', 'fruits', '🌴', 'Khalas Dates', 'تمر خلاص', '1 kg', '١ كجم', 25.0, 40, 'Saudi Arabia'],
  ['fru-strawberry', 'fruits', '🍓', 'Strawberries', 'فراولة', '250 g', '٢٥٠ جم', 11.0, 40, 'Egypt'],
  ['fru-pomegranate', 'fruits', '🔴', 'Pomegranates', 'رمان', '1 kg', '١ كجم', 10.5, 45, 'Turkey'],

  ['dai-milk-fresh', 'dairy', '🥛', 'Fresh Full Cream Milk', 'حليب طازج كامل الدسم', '2 L', '٢ لتر', 12.0, 80, 'Qatar'],
  ['dai-laban', 'dairy', '🥛', 'Laban', 'لبن', '1 L', '١ لتر', 6.0, 80, 'Qatar'],
  ['dai-yoghurt', 'dairy', '🥣', 'Plain Yoghurt', 'زبادي', '1 kg', '١ كجم', 8.5, 60, 'Qatar'],
  ['dai-eggs', 'dairy', '🥚', 'Fresh Eggs (30 pcs)', 'بيض طازج (٣٠ حبة)', '1 tray', '١ طبق', 18.0, 60, 'Qatar'],
  ['dai-labneh', 'dairy', '🧀', 'Labneh', 'لبنة', '400 g', '٤٠٠ جم', 9.5, 40, 'Qatar'],
  ['dai-halloumi', 'dairy', '🧀', 'Halloumi Cheese', 'جبنة حلوم', '250 g', '٢٥٠ جم', 11.75, 40, 'Cyprus'],

  ['bak-arabic-bread', 'bakery', '🫓', 'Arabic Bread (Khubz)', 'خبز عربي', '1 pack (5 pcs)', '١ كيس (٥ حبات)', 2.0, 100, 'Qatar'],
  ['bak-white-bread', 'bakery', '🍞', 'White Sliced Bread', 'خبز توست أبيض', '600 g', '٦٠٠ جم', 5.5, 60, 'Qatar'],
  ['bak-croissant', 'bakery', '🥐', 'Butter Croissants', 'كرواسون بالزبدة', '4 pcs', '٤ حبات', 9.0, 40, 'Qatar'],
  ['bak-samoon', 'bakery', '🥖', 'Samoon Bread', 'خبز صمون', '6 pcs', '٦ حبات', 3.5, 60, 'Qatar'],

  ['pan-basmati', 'pantry', '🍚', 'Basmati Rice', 'أرز بسمتي', '5 kg', '٥ كجم', 32.0, 50, 'India'],
  ['pan-sugar', 'pantry', '🧂', 'White Sugar', 'سكر أبيض', '2 kg', '٢ كجم', 8.0, 60, 'UAE'],
  ['pan-flour', 'pantry', '🌾', 'All Purpose Flour', 'دقيق متعدد الاستعمالات', '2 kg', '٢ كجم', 7.5, 50, 'Qatar'],
  ['pan-oil', 'pantry', '🫒', 'Sunflower Oil', 'زيت دوار الشمس', '1.8 L', '١٫٨ لتر', 15.5, 50, 'Turkey'],
  ['pan-lentils', 'pantry', '🫘', 'Red Lentils', 'عدس أحمر', '1 kg', '١ كجم', 7.0, 50, 'Turkey'],
  ['pan-tea', 'pantry', '🍵', 'Black Tea Bags (100)', 'شاي أسود (١٠٠ كيس)', '1 box', '١ علبة', 13.0, 40, 'Sri Lanka'],
  ['pan-chickpeas', 'pantry', '🥫', 'Chickpeas (canned)', 'حمص معلب', '400 g', '٤٠٠ جم', 3.25, 80, 'Lebanon'],

  ['bev-water-12', 'beverages', '💧', 'Drinking Water 12 x 500 ml', 'مياه شرب ١٢ × ٥٠٠ مل', '1 pack', '١ كرتون', 6.0, 100, 'Qatar'],
  ['bev-water-5g', 'beverages', '🚰', 'Water Gallon Refill 5 gal', 'تعبئة جالون مياه ٥ جالون', '1 gallon', '١ جالون', 10.0, 80, 'Qatar'],
  ['bev-orange-juice', 'beverages', '🧃', 'Fresh Orange Juice', 'عصير برتقال طازج', '1.75 L', '١٫٧٥ لتر', 11.5, 40, 'Qatar'],
  ['bev-soft-drink', 'beverages', '🥤', 'Soft Drink Cans 6 x 330 ml', 'مشروب غازي ٦ × ٣٣٠ مل', '1 pack', '١ عبوة', 9.0, 60, 'Qatar'],

  ['hh-dish-soap', 'household', '🧴', 'Dishwashing Liquid', 'سائل غسيل الصحون', '1 L', '١ لتر', 7.5, 60, 'UAE'],
  ['hh-detergent', 'household', '🧺', 'Laundry Detergent Powder', 'مسحوق غسيل', '3 kg', '٣ كجم', 24.0, 40, 'Saudi Arabia'],
  ['hh-tissues', 'household', '🧻', 'Facial Tissues (5 boxes)', 'مناديل (٥ علب)', '1 pack', '١ عبوة', 12.0, 60, 'UAE'],
  ['hh-toilet-roll', 'household', '🧻', 'Toilet Rolls (10)', 'ورق حمام (١٠ لفات)', '1 pack', '١ عبوة', 14.5, 60, 'Saudi Arabia'],
  ['hh-garbage-bags', 'household', '🗑️', 'Garbage Bags (30)', 'أكياس قمامة (٣٠)', '1 roll', '١ لفة', 6.5, 70, 'UAE'],
  ['hh-floor-cleaner', 'household', '🪣', 'Floor Cleaner', 'منظف أرضيات', '1.5 L', '١٫٥ لتر', 9.75, 40, 'UAE'],

  ['pc-shampoo', 'personal-care', '🧴', 'Shampoo', 'شامبو', '400 ml', '٤٠٠ مل', 14.0, 40, 'UAE'],
  ['pc-soap', 'personal-care', '🧼', 'Bath Soap (4 bars)', 'صابون استحمام (٤ قطع)', '1 pack', '١ عبوة', 8.0, 60, 'Turkey'],
  ['pc-toothpaste', 'personal-care', '🪥', 'Toothpaste', 'معجون أسنان', '100 ml', '١٠٠ مل', 6.5, 60, 'UAE'],
  ['pc-sunscreen', 'personal-care', '☀️', 'Sunscreen SPF 50', 'واقي شمس SPF 50', '200 ml', '٢٠٠ مل', 39.0, 25, 'France'],
];

const products = rows.map(([id, categoryId, emoji, nameEn, nameAr, unitEn, unitAr, price, stock, origin]) => ({
  id,
  categoryId,
  emoji,
  name: { en: nameEn, ar: nameAr },
  unit: { en: unitEn, ar: unitAr },
  price,
  stock,
  origin,
  active: true,
}));

module.exports = { categories, products };
