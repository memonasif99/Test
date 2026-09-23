'use strict';

// Doha-area neighbourhoods served by the store, with a delivery fee in QAR.
// Areas further from the store (located in central Doha) carry a higher fee.
const deliveryAreas = [
  { id: 'al-sadd', name: { en: 'Al Sadd', ar: 'السد' }, fee: 10 },
  { id: 'bin-mahmoud', name: { en: 'Fereej Bin Mahmoud', ar: 'فريج بن محمود' }, fee: 10 },
  { id: 'msheireb', name: { en: 'Msheireb', ar: 'مشيرب' }, fee: 10 },
  { id: 'al-mansoura', name: { en: 'Al Mansoura', ar: 'المنصورة' }, fee: 10 },
  { id: 'najma', name: { en: 'Najma', ar: 'النجمة' }, fee: 10 },
  { id: 'old-airport', name: { en: 'Old Airport', ar: 'المطار القديم' }, fee: 10 },
  { id: 'al-hilal', name: { en: 'Al Hilal', ar: 'الهلال' }, fee: 10 },
  { id: 'al-dafna', name: { en: 'Al Dafna / West Bay', ar: 'الدفنة / الخليج الغربي' }, fee: 12 },
  { id: 'madinat-khalifa', name: { en: 'Madinat Khalifa', ar: 'مدينة خليفة' }, fee: 12 },
  { id: 'al-waab', name: { en: 'Al Waab', ar: 'الوعب' }, fee: 12 },
  { id: 'aspire', name: { en: 'Aspire Zone / Baaya', ar: 'أسباير / بعيا' }, fee: 12 },
  { id: 'abu-hamour', name: { en: 'Abu Hamour', ar: 'أبو هامور' }, fee: 12 },
  { id: 'ain-khalid', name: { en: 'Ain Khalid', ar: 'عين خالد' }, fee: 15 },
  { id: 'the-pearl', name: { en: 'The Pearl', ar: 'اللؤلؤة' }, fee: 15 },
  { id: 'al-gharafa', name: { en: 'Al Gharafa', ar: 'الغرافة' }, fee: 15 },
  { id: 'duhail', name: { en: 'Duhail', ar: 'الدحيل' }, fee: 15 },
  { id: 'al-rayyan', name: { en: 'Al Rayyan', ar: 'الريان' }, fee: 15 },
  { id: 'muaither', name: { en: 'Muaither', ar: 'معيذر' }, fee: 15 },
  { id: 'lusail', name: { en: 'Lusail', ar: 'لوسيل' }, fee: 18 },
  { id: 'al-wakra', name: { en: 'Al Wakra', ar: 'الوكرة' }, fee: 20 },
];

module.exports = { deliveryAreas };
