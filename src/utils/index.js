const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const jwtToken = {
  createToken({ id, email }) {
    return jwt.sign(
      { userId: id, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
    );
  },
  verifyToken(headerJwt) {
    try {
      const token = headerJwt.split(' ')[1];
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return false;
    }
  },
};

const hashPassword = (password) => bcrypt.hashSync(password, 10);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

module.exports = {
  jwtToken,
  hashPassword,
  comparePassword,
};
