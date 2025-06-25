var thisCtxState;
var thisCtxStateUser;
export default {
  beforeCreate(event) {
    const ctx = strapi.requestContext.get(); // Mendapatkan konteks request
    thisCtxState = ctx?.state;
    thisCtxStateUser = thisCtxState?.user;
    // console.log("thisCtx created:", ctx?.state);

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
  // async afterCreate(event) {
  //   const { result } = event; // result adalah entitas Address yang baru saja dibuat
  //   // const ctx = strapi.requestContext.get(); // Mendapatkan konteks request
  //   // console.log("Event created:", event);
  //   // console.log("result created:", result);
  //   // console.log("thisCtx created:", thisCtxState);

  //   // Pastikan ada pengguna yang terautentikasi dan alamat baru adalah mainAddress
  //     console.log("Berubah yang lain", result.mainAddress);
  //     console.log("All Berubah yang lain", thisCtxState);
  //     console.log("User Berubah yang lain", thisCtxStateUser);

  //   if (thisCtxState && thisCtxState.user && result.mainAddress === true) {
  //     const userId = thisCtxState.user.id; // ctx.state.user diakses via event.state
  //     const newAddressId = result.id; // ID dari alamat yang baru dibuat

  //     try {
  //       // Update semua alamat lain milik pengguna ini
  //       // untuk mengatur mainAddress menjadi false, KECUALI alamat yang baru dibuat.
  //       const updatedAddresses = await strapi.db.query('api::address.address').updateMany({
  //         where: {
  //           user: userId,
  //           id: { $ne: newAddressId } // Penting: Jangan update alamat yang baru dibuat
  //         },
  //         data: {
  //           mainAddress: false,
  //         },
  //       });
  //       console.log(`Successfully unset mainAddress for ${updatedAddresses.count} other addresses for user ${userId}.`);

  //     } catch (error) {
  //       console.error("Error unsetting mainAddress for other addresses in afterCreate:", error);
  //       // Anda bisa log error atau melemparnya lagi jika ini kritis
  //       // throw error;
  //     }
  //   }
  // },
};