export default {
  beforeCreate(event) {
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

    if (ctx?.state?.user) {
      const loggedInUserId = ctx.state.user.id;
      // strapi.log.info('Logged-in User ID:', loggedInUserId);

      // Tambahkan user yang sedang login ke data yang akan dibuat
      event.params.data.user = loggedInUserId;
    } else {
      strapi.log.error('User not found in ctx.state');
    }
  },
  // ...existing code...
};
  // afterCreate(event) {
  //   console.log("hello");
  // },

  // beforeUpdate(event) {
  //   console.log("hello");
  // },

  // afterUpdate(event) {
  //   console.log("hello");
  // },
