// filepath: ./config/logger.js
const { createLogger, transports, format } = require('winston');

module.exports = {
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({
      filename: 'logs/strapi.log', // Lokasi file log
      level: 'error', // Simpan hanya log error
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
};