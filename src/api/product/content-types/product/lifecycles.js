export default {
  beforeCreate(event) {
    const ctx = strapi.requestContext.get(); // Mendapatkan konteks request

    if (ctx?.state?.user) {
      const loggedInUserId = ctx.state.user.id;
      strapi.log.info('Logged-in User ID:', loggedInUserId);

      // Tambahkan user yang sedang login ke data yang akan dibuat
      event.params.data.user = loggedInUserId;
    } else {
      strapi.log.error('User not found in ctx.state');
    }
  },

  // afterCreate(event) {
  //   console.log("hello");
  // },

  // beforeUpdate(event) {
  //   console.log("hello");
  // },

  // afterUpdate(event) {
  //   console.log("hello");
  // },
};