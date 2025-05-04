"use strict";

/**
 * Middleware: is-owner
 * 
 * Deskripsi:
 * Middleware ini digunakan untuk membatasi akses berdasarkan role user (`Penjual`, `PenjualAnggota`, dan `Pembeli`).
 * - `Penjual`: Dapat CREATE, READ, UPDATE, DELETE data yang dimiliki.
 * - `PenjualAnggota`: Hanya dapat READ data yang dimiliki oleh `Penjual` (berdasarkan `userParent`).
 * - `Pembeli`: Hanya dapat READ semua data yang ada.
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const entryId = ctx.params.id; // ID dari entri yang diminta (jika ada)
    const user = ctx.state.user; // User yang sedang login
    const userId = user?.id; // ID dari user yang sedang login
    const userRole = user?.role?.name; // Role user yang sedang login

    // Jika user belum login, kembalikan respons unauthorized
    // if (!userId) return ctx.unauthorized(`You can't access this entry`);

    // Log informasi context state untuk debugging
    // strapi.log.info("Middleware - Context State:", ctx.state);

    // Ambil nama API dari route yang sedang diakses
    const apiName = ctx.state.route.info.apiName;

    // Fungsi untuk menghasilkan UID (Unique Identifier) dari API
    function generateUID(apiName) {
      return `api::${apiName}.${apiName}`;
    }

    const appUid = generateUID(apiName); // UID dari API yang sedang diakses
    strapi.log.info(appUid);

    if (userRole === "Super Admin" || ctx.state.isAdmin) {
      return await next(); // Lewati middleware untuk Super Admin atau Admin Panel
    }

    if (entryId) {
      // Jika parameter ID tersedia, muat entri dari database
      const entry = await strapi.entityService.findOne(appUid, entryId, {
        populate: "user", // Pastikan relasi user dipopulasikan
      });
      strapi.log.info(entry);

      // Periksa akses berdasarkan role
      if (userRole === "Saler") {
        // Penjual hanya dapat mengakses data miliknya sendiri
        if (!entry || entry.user?.id !== userId) {
          return ctx.unauthorized(`You can't access this entry`);
        }
      } else if (userRole === "SalerMember") {
        // PenjualAnggota hanya dapat READ data milik userParent
        if (ctx.request.method !== "GET" || !entry || entry.user?.id !== user.userParent?.id) {
          return ctx.unauthorized(`You can't access this entry`);
        }
      } else /*if (userRole === "Buyer")*/ {
        // Pembeli hanya dapat READ semua data
        if (ctx.request.method !== "GET") {
          return ctx.unauthorized(`You can't perform this action`);
        }
      } 
      // else {
      //   // Role tidak dikenal
      //   return ctx.forbidden("Your role is not authorized to access this resource");
      // }
    } else {
      // Jika parameter ID tidak tersedia, tambahkan filter untuk membatasi data berdasarkan role
      if (userRole === "Saler") {
        // Penjual hanya dapat melihat data miliknya sendiri
        ctx.query = {
          ...ctx.query,
          filters: { ...ctx.query.filters, user: userId },
        };
      } else if (userRole === "SalerMember") {
        // PenjualAnggota hanya dapat melihat data milik userParent
        ctx.query = {
          ...ctx.query,
          filters: { ...ctx.query.filters, user: user.userParent?.id },
        };
      } else if (userRole === "Buyer") {
        // Pembeli dapat melihat semua data (tidak ada filter tambahan)
        // Tidak perlu menambahkan filter
      } else {
        // Role tidak dikenal
        // return ctx.forbidden("Your role is not authorized to access this resource");
      }

      strapi.log.info(ctx.query);
    }

    // Lanjutkan ke middleware berikutnya
    await next();
  };
};