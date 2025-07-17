module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // 'global::logger',
  // {
  //   name: 'global::checkItemOwnership',
  //   // config: {
  //   //   // Konfigurasi middleware (jika diperlukan)
  //   // },
  // },
];
// console.log('Loading middleware: checkItemOwnership');