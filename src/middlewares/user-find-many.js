"use strict";

/**
 * Middleware: user-find-many-owner
 * 
 * Deskripsi:
 * Middleware ini digunakan untuk memastikan bahwa user yang sedang login hanya dapat mengakses
 * data miliknya sendiri saat melakukan operasi "find many". Middleware ini menambahkan filter
 * ke query untuk membatasi data yang diambil berdasarkan ID user yang sedang login.
 * 
 * Alur Kerja:
 * 1. Middleware memeriksa apakah user sudah login dengan memeriksa `ctx.state.user`.
 * 2. Middleware mengambil ID user yang sedang login dari `ctx.state.user.id`.
 * 3. Middleware menambahkan filter ke query untuk membatasi data berdasarkan ID user.
 * 4. Jika semua validasi berhasil, middleware memanggil `next()` untuk melanjutkan ke middleware berikutnya.
 * 
 * Parameter:
 * - `config`: Konfigurasi middleware (tidak digunakan dalam implementasi ini).
 * - `strapi`: Objek Strapi untuk mengakses layanan dan utilitas Strapi.
 * 
 * Catatan:
 * - Middleware ini mengandalkan ID user yang sedang login (`ctx.state.user.id`).
 * - Pastikan properti `ctx.state.user` sudah diatur sebelumnya oleh middleware autentikasi.
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    strapi.log.info("In user-find-many-owner middleware.");

    // Ambil ID user yang sedang login
    const currentUserId = ctx.state?.user?.id;

    // Periksa apakah user sudah login
    if (!currentUserId) {
      strapi.log.error("You are not authenticated.");
      return ctx.badRequest("You are not authenticated.");
    }

    // Tambahkan filter ke query untuk membatasi data berdasarkan ID user
    ctx.query = {
      ...ctx.query,
      filters: { ...ctx.query.filters, id: currentUserId },
    };

    // Lanjutkan ke middleware berikutnya
    await next();
  };
};