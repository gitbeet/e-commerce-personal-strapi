'use strict';

/**
 * spec service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::spec.spec');
