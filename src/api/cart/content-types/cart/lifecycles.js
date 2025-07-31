import { errors } from '@strapi/utils';
const { ValidationError } = errors;

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();

    const isSuperAdmin =
      ctx?.state?.user?.roles &&
      Array.isArray(ctx.state.user.roles) &&
      ctx.state.user.roles.length > 0 &&
      ctx.state.user.roles[0].name === 'Super Admin';

    if (isSuperAdmin) {
      strapi.log.info('Super Admin detected, skipping user assignment.');
      return;
    }

    if (ctx?.state?.user) {
      const loggedInUserId = ctx.state.user.id;
      event.params.data.user = loggedInUserId;

      const tagDocumentId = event.params.data.tag.set[0]?.id;

      if (!tagDocumentId) {
        throw new ValidationError('Tag ID tidak ditemukan dalam data permintaan');
      }

      const existingCart = await strapi.entityService.findMany('api::cart.cart', {
        filters: {
          user: loggedInUserId,
          tag: { id: { $eq: tagDocumentId } },
        },
      });

      if (existingCart.length > 0) {
        const error = new ValidationError('Produk sudah ada di keranjang belanjamu, ayo cek keranjangmu');
        error.status = 409; // Kode status conflict
        throw error;
      }
    } else {
      strapi.log.error('User not found in ctx.state');
    }
  }
};
