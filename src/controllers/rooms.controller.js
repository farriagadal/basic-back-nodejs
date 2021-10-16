const models = require('../models');

const addRoom = (req, res) => {
  const room = {
    userId: req.body.userId, // borrar
    name: req.body.name,
    count: req.body.count,
    status: req.body.status,
  };

  models.Room.create(room)
    .then((result) => {
      res.status(201).json({
        message: 'Room created successfully',
        room: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Something went wrong',
        error,
      });
    });
};

const getRooms = (req, res) => {
  models.Room.findAll({
    include: [{
      model: models.User,
      as: 'owner',
      attributes: ['firstName', 'lastName', 'email'],
    }],
  })
    .then((results) => {
      res.status(201).json({
        rooms: results,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Something went wrong',
        error,
      });
    });
};

const getRoomsOfUser = (req, res) => {
  models.Room.findAll()
    .then((results) => {
      res.status(201).json({
        rooms: results,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Something went wrong',
        error,
      });
    });
};

module.exports = {
  addRoom,
  getRooms,
  getRoomsOfUser,
};
