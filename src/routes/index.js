const express = require('express');

const { room, auth } = require('../controllers');

const router = express.Router();

router.post('/sign-up', auth.signUp);
router.post('/login', auth.signIn);
router.get('/verify-email', auth.verifyEmailToken);
router.post('/resend-email', auth.resendEmail);
router.get('/verify-session', auth.verifySessionToken);

// get all user
// router.get('/users', users.getUsers)

// get all rooms
router.get('/rooms', room.getRooms);

// // get room
// router.get('/rooms/:id', room.getRoom)

// add room
router.post('/rooms', room.addRoom);

// // update room
// router.put('/rooms/:id', room.getRoom)

// // delete room
// router.delete('/rooms/:id', room.getRoom)

module.exports = router;
