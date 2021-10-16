module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    emailToken: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    isPremium: DataTypes.BOOLEAN,
    workspace: DataTypes.STRING,
  });

  User.associate = (models) => {
    User.hasMany(models.Room, {
      foreignKey: 'userId',
    });
  };

  return User;
};
