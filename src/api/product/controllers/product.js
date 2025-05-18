'use strict';

/**
 *  product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product',
  ({ strapi }) => ({
    async find(ctx) {
      const allowed = ['start', 'limit'];

      // Ambil hanya parameter yang diizinkan dari ctx.query
      const safeQuery = Object.fromEntries(
        Object.entries(ctx.query).filter(([key]) => allowed.includes(key))
      );

      const products = await strapi.entityService.findMany('api::product.product', {
        ...safeQuery,
        populate: {
          category: true,
          images: true,
          user: {
            fields: ['username', 'documentId'],
            populate: {
              addresses: true,
            },
          },
          tags: {
            sort: ['price:asc'],
          },
        },
        filters: ctx.query.filters || {},
        sort: ctx.query.sort || ['name:asc'],
      });
      // Hitung jumlah tags untuk setiap product
      const productCount = await strapi.entityService.count('api::product.product', {
        filters: ctx.query.filters || {},
      });

      return {
        data: products,
        meta: { productCount: productCount },
      };
    }

  })
);
