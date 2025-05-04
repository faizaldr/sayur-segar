module.exports = {
    routes: [
        {
            method: "POST",
            path: "/update-role",
            handler: "user.updateRole",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
