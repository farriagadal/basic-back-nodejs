module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: DataTypes.STRING,
    count: DataTypes.STRING,
    status: DataTypes.STRING,
  });

  Room.associate = (models) => {
    Room.belongsTo(models.User, {
      as: 'owner',
      foreignKey: {
        name: 'userId',
        allowDelete: false,
      },
    });
  };

  return Room;
};
