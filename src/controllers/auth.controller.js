const Validator = require('fastest-validator');
const crypto = require('crypto');

const { sendConfirmationEmail } = require('../mailer');
const models = require('../models');
const { hashPassword, jwtToken, comparePassword } = require('../utils');

const auth = {
  async signUp(req, res, next) {
    try {
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      };

      const schema = {
        firstName: { type: 'string', optional: false, max: '100' },
        lastName: { type: 'string', optional: false, max: '100' },
        email: { type: 'email', optional: false, max: '100' },
        password: { type: 'string', optional: false, max: '100' },
      };

      const v = new Validator();
      const validationResponse = v.validate(user, schema);

      if (validationResponse !== true) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validationResponse,
        });
      }

      const exist = await models.User.findOne({ where: { email: req.body.email } });

      if (exist) {
        return res.status(409).json({
          message: 'Email already exists!',
        });
      }

      user.password = hashPassword(user.password);
      user.emailToken = crypto.randomBytes(64).toString('hex');

      // return res.status(201).send(user.emailToken)
      return models.User.create(user)
        .then(() => {
          sendConfirmationEmail(user);
          return res.status(201).send({ message: 'Confirmation email sent!' });
        })
        .catch((error) => res.status(500).json({
          message: 'Something went wrong!',
          error,
        }));
    } catch (e) {
      return next(new Error(e));
    }
  },

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await models.User.findOne({ where: { email } });
      if (user && comparePassword(password, user.password)) {
        const { id, firstName, lastName } = user;
        if (!user.isVerified) {
          return res.status(400).send({
            error: {
              message: 'User no Verified',
              emailInvalid: true,
            },
            user: {
              id, firstName, lastName, email,
            },
          });
        }
        const token = jwtToken.createToken(user);
        return res.status(200).send({
          token,
          user: {
            id, firstName, lastName, email,
          },
        });
      }
      return res.status(400).send({ error: 'Invalid email/password combination' });
    } catch (e) {
      return next(new Error(e));
    }
  },

  async verifyEmailToken(req, res, next) {
    try {
      const user = await models.User.findOne({ where: { emailToken: req.query.token } });
      if (!user) {
        return res.status(400).send({ error: 'Invalid token' });
      }
      user.emailToken = null;
      user.isVerified = true;
      await user.save();
      const token = jwtToken.createToken(user);
      const {
        id, firstName, lastName, email,
      } = user;
      return res.status(200).send({
        message: 'Account verified correctly!',
        token,
        user: {
          id, firstName, lastName, email,
        },
      });
    } catch (e) {
      return next(new Error(e));
    }
  },

  async resendEmail(req, res, next) {
    try {
      const v = new Validator();
      const schema = {
        email: { type: 'email', optional: false, max: '100' },
      };
      const validationResponse = v.validate({ email: req.body.email }, schema);
      if (validationResponse !== true) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validationResponse,
        });
      }

      const user = await models.User.findOne({ where: { email: req.body.email } });
      if (!user) {
        return res.status(400).send({ error: 'Invalid email' });
      }
      if (!user.emailToken) {
        return res.status(400).send({ message: 'User already verified' });
      }
      sendConfirmationEmail(user);
      return res.status(200).send({ message: 'Confirmation email sent!' });
    } catch (e) {
      return next(new Error(e));
    }
  },

  async verifySessionToken(req, res, next) {
    try {
      const { authorization } = req.headers;
      const decoded = jwtToken.verifyToken(authorization);

      if (!decoded) {
        return res.status(400).send({ message: 'Invalid token' });
      }
      const user = await models.User.findOne({ where: { id: decoded.userId } });
      const newToken = jwtToken.createToken(user);
      const {
        id, firstName, lastName, email,
      } = user;
      return res.status(200).send({
        token: newToken,
        user: {
          id, firstName, lastName, email,
        },
      });
    } catch (e) {
      return next(new Error(e));
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { password } = req.body;
      const { token } = req.params;
      const decoded = jwtToken.verifyToken(token);
      const hash = hashPassword(password);
      const updatedUser = await models.User.update(
        { password: hash },
        {
          where: { id: decoded.userId },
          returning: true,
          plain: true,
        },
      );
      const { id, name, email } = updatedUser[1];
      return res.status(200).send({ token, user: { id, name, email } });
    } catch (e) {
      return next(new Error(e));
    }
  },

  // testEmail(req, res, next) {
  //   const mailOptions = {
  //     from: 'neokey23@gmail.com',
  //     to: 'farriagadal94@gmail.com',
  //     subject: 'Sending Email using Node.js',
  //     text: 'That was easy!'
  //   }
  //   sendMail(mailOptions)

  //   return res.status(200).send(mailOptions)
  // }
};

module.exports = auth;
