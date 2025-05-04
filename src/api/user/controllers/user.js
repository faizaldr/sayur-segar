'use strict';

module.exports = {
  async updateRole(ctx) {
      const { roleType } = ctx.request.body;

      // Ambil role berdasarkan tipe
      const roles = await strapi.entityService.findMany(
          "plugin::users-permissions.role",
          {
              filters: { type: roleType },
          }
      );

      if (!roles || roles.length === 0) {
          return ctx.badRequest("Role not found");
      }

      const role = roles[0];

      // Perbarui role user
      const updatedUser = await strapi.entityService.update(
          "plugin::users-permissions.user",
          ctx.state.user.id,
          {
              data: {
                  role: role.id,
              },
          }
      );

      ctx.send(updatedUser);
  },
};