"use strict";

/**
 * `checkItemOwnership` middleware
 */

// module.exports = (config, { strapi }) => {
//   return async (ctx, next) => {
//     const user = ctx.state.user; // Ambil data pengguna yang sedang login
//     const { id } = ctx.params; // Ambil ID dari parameter URL

//     // try {
//       console.log('Logged-in User:', user);
//       console.log('Requested Item ID:', id);

//       // Ambil data tag berdasarkan ID dan populasi relasi users_permissions_user
//       const item = await strapi.entityService.findOne('api::tag.tag', id, {
//         populate: { users_permissions_user: true }, // Pastikan relasi dipopulasikan
//       });

//       console.log('Item:', item);
//       console.log('Item Owner:', item?.users_permissions_user);

//       // Periksa apakah item ditemukan
//       if (!item) {
//         console.log('Item not found');
//         return ctx.notFound('Data tidak ditemukan');
//       }

//       // Periksa apakah pengguna yang sedang login adalah pemilik tag
//       if (!item.users_permissions_user || item.users_permissions_user.id !== user.id) {
//         console.log('Ownership validation failed');
//         return ctx.unauthorized('Anda bukan pemilik data ini');
//       }

//       // Validasi berhasil, lanjutkan ke handler berikutnya
//       console.log('Ownership validation passed');
//       return next();
//     // } catch (error) {
//     //   // Tangani error yang tidak terduga
//     //   console.error('Error in checkItemOwnership middleware:', error);
//     //   return ctx.internalServerError('Terjadi kesalahan pada server');
//     // }
//   };
// };

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    console.log('Middleware checkItemOwnership is running');
    const user = ctx.state.user;
    const entryId = ctx.params.id;

    console.log('User:', user);
    console.log('Entry ID:', entryId);

    let entry = {};
    if (entryId) {
      console.log('Fetching entry...');
      entry = await strapi.entityService.findOne('api::tag.tag', entryId, {
        populate: "*",
      });
    }

    console.log('Entry:', entry);
    if (!entry || !entry.author) {
      console.log('Entry or author not found');
      return ctx.notFound('Entry or author not found');
    }

    if (user.id !== entry.author.id) {
      console.log('User is not the owner');
      return ctx.unauthorized('This action is unauthorized.');
    }

    console.log('Ownership validation passed');
    return next();
  };
};