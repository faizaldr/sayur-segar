'use strict';

/**
 *  product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
  async find(ctx) {
    // Fetch data with populated tags
    const products = await strapi.entityService.findMany('api::product.product', {
      populate: {
        images: true,
        tags: {
          sort: ['price:asc'], // Sort tags by price
        },
      },
      filters: ctx.query.filters || {}, // Apply filters if provided
      sort: ctx.query.sort || ['name:asc'], // Default sorting by name
    });

    return products;
  },
}));
