'use strict';

/**
 * address controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::address.address', ({ strapi }) => ({
    async find(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('Anda harus login untuk melihat pesanan Anda');
        }

        // Pastikan filters tetap ada tanpa menimpa populate/pagination dsb
        const userFilter = { user: { id: user.id } };

        // Gabungkan filter user ke filter existing dari query
        ctx.query.filters = {
            ...ctx.query.filters,
            ...userFilter,
        };

        // Panggil fungsi find bawaan Strapi
        const response = await super.find(ctx);

        // Kembalikan format standar bawaan Strapi { data, meta }
        return response;
    },
}));
