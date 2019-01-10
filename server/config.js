module.exports = {
  // 5000 par défaut si le .env n'est pas créé
  port: process.env.PORT || 5000,
  jwtOptions: {
    secret: process.env.JWT_SECRET,
  },
  atlasConnectionString: process.env.ATLAS_CONNECTION_STRING,
};
