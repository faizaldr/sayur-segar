module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        strapi.log.error(`Error occurred: ${err.message}`);
        throw err;
      }
    };
  };