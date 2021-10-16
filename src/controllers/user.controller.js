const Validator = require('fastest-validator');
// const crypto = require('crypto');

const { sendPasswordRecoveryEmail } = require('../mailer');
const models = require('../models');
const { jwtToken, hashPassword } = require('../utils');

const user = {
  updateProfile: (req, res, next) => {
    try {
      const updatedUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      };

      const schema = {
        firstName: { type: 'string', optional: false, max: '100' },
        lastName: { type: 'string', optional: false, max: '100' },
        email: { type: 'email', optional: false, max: '100' },
      };

      const v = new Validator();
      const validationResponse = v.validate(user, schema);

      if (validationResponse !== true) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validationResponse,
        });
      }

      const { authorization } = req.headers;
      const decoded = jwtToken.verifyToken(authorization);

      return models.User.update(updatedUser, { where: { id: decoded.userId } })
        .then((results) => res.status(201).send({ success: true, results }))
        .catch((error) => res.status(500).json({
          message: 'Something went wrong!',
          error,
        }));
    } catch (e) {
      return next(new Error(e));
    }
  },

  updatePassword: (req, res, next) => {
    try {
      const updatedUser = {
        password: req.body.password,
      };

      const schema = {
        password: { type: 'string', optional: false, max: '100' },
      };
      const v = new Validator();
      const validationResponse = v.validate(updatedUser, schema);

      if (validationResponse !== true) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validationResponse,
        });
      }

      const { authorization } = req.headers;
      const decoded = jwtToken.verifyToken(authorization);
      updatedUser.password = hashPassword(updatedUser.password);

      return models.User.update(updatedUser, { where: { id: decoded.userId } })
        .then((results) => res.status(201).send({
          success: true,
          results,
          message: 'Password changed successfully!',
        }))
        .catch((error) => res.status(500).json({
          message: 'Something went wrong!',
          error,
        }));
    } catch (e) {
      return next(new Error(e));
    }
  },

  recoveryPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      const userUpdated = await models.User.findOne({ where: { email } });
      if (!userUpdated) {
        return res.status(400).send({ error: 'Email is invalid' });
      }
      user.emailToken = jwtToken.createPasswordToken(user);
      sendPasswordRecoveryEmail(user);
      return res.status(201).send({ message: 'Confirmation email sent!' });
    } catch (e) {
      return next(new Error(e));
    }
  },

  changeRecoveryPassword: async (req, res, next) => {
    try {
      const { token, password } = req.body;

      const schema = { password: { type: 'string', optional: false, max: '100' } };
      const v = new Validator();
      const validation = v.validate({ password }, schema);
      if (validation !== true) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation,
        });
      }

      const userUpdated = await models.User.findOne({ where: { emailToken: token } });
      if (!userUpdated) {
        return res.status(400).send({ error: 'Email is invalid' });
      }
      userUpdated.password = hashPassword(password);
      await userUpdated.save();
      const accessToken = jwtToken.createToken(userUpdated);
      const {
        id,
        firstName,
        lastName,
        email,
      } = userUpdated;

      return res.status(200).send({
        success: true,
        token: accessToken,
        user: {
          id, firstName, lastName, email,
        },
      });
    } catch (e) {
      return next(new Error(e));
    }
  },

  createWorkspace: async (req, res, next) => {
    try {
      const accessToken = req.body.token;
      const userUpdated = await models.User.findOne({ where: { sessionToken: accessToken } });
      if (!req.body.workspace) {
        return res.status(400).send({ error: 'Workspace field is required' });
      }
      userUpdated.workspace = req.body.workspace;
      await userUpdated.save();
      return res.status(201).send({
        message: 'Workspace updated',
      });
    } catch (e) {
      return next(new Error(e));
    }
  },
};

module.exports = user;
