'use strict';

/**
 * review controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::review.review', ({ strapi }) => ({
    async find(ctx) {
        // Ambil user yang login
        const userId = ctx.state.user.id;

        // Tambahkan filter user ke query
        ctx.query = {
            ...ctx.query,
            filters: {
                ...ctx.query.filters,
                user: { id: userId },
            },
        };

        // Panggil find bawaan Strapi
        const response = await super.find(ctx);

        // response tetap dalam format { data, meta }
        return response;
    },
}));
