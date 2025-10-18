export default {
  beforeCreate(event) {
    const ctx = strapi.requestContext.get(); // Mendapatkan konteks request

    console.log("ctx", ctx?.state?.user);

    // Validasi apakah user memiliki roles
    const isSuperAdmin =
      ctx?.state?.user?.roles &&
      Array.isArray(ctx.state.user.roles) &&
      ctx.state.user.roles.length > 0 &&
      ctx.state.user.roles[0].name === 'Super Admin';

    if (isSuperAdmin) {
      // Jika user adalah Super Admin, lewati logika ini
      strapi.log.info('Access by Super Admin, skipping beforeCreate logic.');
      return;
    }

    if (ctx?.state?.user) {
      const loggedInUserId = ctx.state.user.id;
      strapi.log.info('Logged-in User ID:', loggedInUserId);

      // Tambahkan user yang sedang login ke data yang akan dibuat
      event.params.data.user = loggedInUserId;
    } else {
      strapi.log.error('User not found in ctx.state');
    }

    // Tambahkan 800 ke field price saat create
    if (typeof event.params.data.price === 'number') {
      event.params.data.price += 800;
    }
  },

  beforeUpdate(event) {
    // Tambahkan 800 ke field price saat update
    if (typeof event.params.data.price === 'number') {
      event.params.data.price += 800;
    }
  },
  
  // afterCreate(event) {
  //   console.log("hello");
  // },

  // afterUpdate(event) {
  //   console.log("hello");
  // },
};