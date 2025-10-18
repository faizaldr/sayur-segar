/**
 * Middleware: user-can-update
 * 
 * Deskripsi:
 * Middleware ini digunakan untuk memastikan bahwa user yang sedang login hanya dapat memperbarui
 * data miliknya sendiri. Middleware ini memeriksa apakah user yang sedang login memiliki izin
 * untuk memperbarui data berdasarkan ID user yang diminta.
 * 
 * Alur Kerja:
 * 1. Middleware memeriksa apakah user sudah login dengan memeriksa `ctx.state.user`.
 * 2. Middleware memeriksa apakah parameter `id` (ID user yang diminta) tersedia di URL.
 * 3. Middleware membandingkan ID user yang sedang login dengan ID user yang diminta:
 *    - Jika ID tidak cocok, middleware mengembalikan respons `unauthorized`.
 * 4. Middleware memfilter properti yang dapat diperbarui menggunakan `lodash.pick` untuk
 *    mencegah user memperbarui properti yang tidak diizinkan.
 * 5. Jika semua validasi berhasil, middleware memanggil `next()` untuk melanjutkan ke middleware berikutnya.
 * 
 * Parameter:
 * - `config`: Konfigurasi middleware (tidak digunakan dalam implementasi ini).
 * - `strapi`: Objek Strapi untuk mengakses layanan dan utilitas Strapi.
 * 
 * Catatan:
 * - Middleware ini mengandalkan ID user yang sedang login (`ctx.state.user.id`) dan ID user yang diminta (`ctx.params.id`).
 * - Properti yang dapat diperbarui didefinisikan dalam array `["firstName", "lastName", "bio", "image"]`.
 * - Pastikan properti yang diizinkan untuk diperbarui sesuai dengan kebutuhan aplikasi Anda.
 */

"use strict";
const _ = require("lodash");

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    strapi.log.info("In user-can-update middleware.");

    // Periksa apakah user sudah login
    if (!ctx.state?.user) {
      strapi.log.error("You are not authenticated.");
      return ctx.badRequest("You are not authenticated.");
    }

    const params = ctx.params;
    const requestedUserId = params?.id; // ID user yang diminta
    const currentUserId = ctx.state?.user?.id; // ID user yang sedang login

    // Periksa apakah ID user yang diminta tersedia
    if (!requestedUserId) {
      strapi.log.error("Missing user ID.");
      return ctx.badRequest("Missing or invalid user ID.");
    }

    // Periksa apakah user yang sedang login adalah pemilik data
    if (Number(currentUserId) !== Number(requestedUserId)) {
      return ctx.unauthorized("You are not authorized to perform this action.");
    }

    // Filter properti yang dapat diperbarui
    ctx.request.body = _.pick(ctx.request.body, [
      "firstName",
      "lastName",
      "bio",
      "image",
    ]);

    // Lanjutkan ke middleware berikutnya
    await next();
  };
};