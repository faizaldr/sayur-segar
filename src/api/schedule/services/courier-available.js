'use strict';

/**
 * schedule
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::schedule.schedule');
