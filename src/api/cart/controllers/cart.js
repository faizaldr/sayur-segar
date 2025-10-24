'use strict';

/**
 * cart controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cart.cart', ({ strapi }) => ({
    async delete(ctx) {
        const { id } = ctx.params;

        if (!id) {
            return ctx.throw(400, 'Parameter documentId is required.');
        }

        try {
            // Cari semua entry yang memiliki documentId yang diminta
            const entries = await strapi.entityService.findMany('api::cart.cart', {
                filters: { documentId: id },
                limit: -1,
            });

            if (!entries || entries.length === 0) {
                return ctx.notFound(`No cart entries found for documentId: ${id}`);
            }

            // Hapus semua entry yang ditemukan
            await Promise.all(
                entries.map((entry) =>
                    strapi.entityService.delete('api::cart.cart', entry.id)
                )
            );

            return ctx.send({ message: 'Deleted cart entries', deletedCount: entries.length });
        } catch (err) {
            return ctx.throw(500, err);
        }
    },
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