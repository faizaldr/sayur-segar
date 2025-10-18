'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::tag.tag', {
    config: {
        find: {
            middlewares: [
                // "global::is-owner"

            ],
        },
        findOne: {
            middlewares: [
                // "global::is-owner"

            ],
        },
        update: {
            middlewares: ["global::is-owner"],
        },
        delete: {
            middlewares: ["global::is-owner"],
        },
        create: {
            // Nonaktifkan middleware untuk sementara
            middlewares: [],
        },
    },
});