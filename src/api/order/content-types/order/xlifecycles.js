export default {
  beforeUpdate(event) {
    const ctx = strapi.requestContext.get(); // Mendapatkan konteks request

    // Cek jika user adalah Super Admin
    const isSuperAdmin =
      ctx?.state?.user?.roles &&
      Array.isArray(ctx.state.user.roles) &&
      ctx.state.user.roles.length > 0 &&
      ctx.state.user.roles[0].name === 'Super Admin';

    if (isSuperAdmin) {
      strapi.log.info('Super Admin detected, skipping user assignment.');
      return; // Lewati penambahan user
    }

    const { where } = event.params;

    // Pastikan hanya `id` yang digunakan sebagai parameter
    if (!where || !where.id) {
      throw new Error('Update hanya diperbolehkan menggunakan document id.');
    }
  },
  beforeDelete(event) {
    const ctx = strapi.requestContext.get(); // Mendapatkan konteks request

    // Cek jika user adalah Super Admin
    const isSuperAdmin =
      ctx?.state?.user?.roles &&
      Array.isArray(ctx.state.user.roles) &&
      ctx.state.user.roles.length > 0 &&
      ctx.state.user.roles[0].name === 'Super Admin';

    if (isSuperAdmin) {
      strapi.log.info('Super Admin detected, skipping user assignment.');
      return; // Lewati penambahan user
    }

    const { where } = event.params;

    // Pastikan hanya `id` yang digunakan sebagai parameter
    if (!where || !where.id) {
      throw new Error('Update hanya diperbolehkan menggunakan document id.');
    }
  }
};