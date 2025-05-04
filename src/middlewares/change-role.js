// filepath: src/middlewares/your-custom-middleware.js
"use strict";

module.exports = () => {
    return async (ctx, next) => {
        // Jalankan proses pendaftaran user terlebih dahulu
        await next();

        // Periksa apakah request adalah pendaftaran user
        if (ctx.request.url === '/api/auth/local/register' && ctx.response.status === 200) {
            // Ambil user berdasarkan email
            const userArray = await strapi.entityService.findMany(
                "plugin::users-permissions.user",
                {
                    filters: { email: ctx.request.body.email },
                }
            );

            if (!userArray || userArray.length === 0) {
                throw new Error("User not found");
            }

            const user = userArray[0];

            // Ambil role yang diinginkan
            const roles = await strapi.entityService.findMany(
                "plugin::users-permissions.role",
                {
                    filters: { type: "saler" }, // Ganti "saler" dengan tipe role yang diinginkan
                }
            );

            if (!roles || roles.length === 0) {
                throw new Error("Role not found");
            }

            const salerRole = roles[0];

            // Perbarui user dengan role baru
            await strapi.entityService.update(
                "plugin::users-permissions.user",
                user.id,
                {
                    data: {
                        role: salerRole.id,
                    },
                }
            );
        }
    };
};