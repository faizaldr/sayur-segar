'use strict';

/**
 * cart router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::cart.cart', {
    config: {
        find: {
            middlewares: [
                "global::is-owner"

            ],
        },
        findOne: {
            middlewares: [
                "global::is-owner"

            ],
        },
        update: {
            middlewares: ["global::is-owner-buyer"],
        },
        delete: {
            middlewares: ["global::is-owner-buyer"],
        },
        // create: {
        //     // Nonaktifkan middleware untuk sementara
        //     middlewares: [],
        // },
    },
});
