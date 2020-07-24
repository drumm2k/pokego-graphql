import {} from 'dotenv/config';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

import { user } from './merge';

const TOKEN_EXPIRY = '2h';
const RESET_PASSWORD_TOKEN_EXPIRY = 86400;

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const userResolver = {
  Query: {
    getUser: async (_parent, { userName }, { models }) => {
      try {
        const userData = await models.User.findOne({ userName: userName });
        return user(userData);
      } catch (error) {
        throw error;
      }
    },
    getUsers: async (_parent, _args, { models }) => {
      try {
        const usersData = await models.User.find();
        return usersData.map((userData) => {
          return user(userData);
        });
      } catch (error) {
        throw error;
      }
    },
    confirm: async (_parent, { token }, { models }) => {
      try {
        const authUser = await jwt.verify(token, process.env.JWT_SECRET);
        if (!authUser) return false;

        await models.User.findByIdAndUpdate(
          { _id: authUser.id },
          { confirmed: true }
        );
        return true;
      } catch (error) {
        return false;
      }
    },
    searchUsers: async (_parent, { query }, { user, models }) => {
      if (!user) {
        throw new Error('Unathorized');
      }

      if (!query) {
        return [];
      }

      const users = models.User.find({
        $or: [{ userName: new RegExp(query, 'i') }],
        _id: {
          $ne: user.id,
        },
      }).limit(20);

      return users;
    },
  },
  Mutation: {
    signUp: async (_parent, { input }, { models }) => {
      const { userName, email, password, trainer, location, telegram } = input;
      try {
        const checkEmail = await models.User.findOne({ email: email });
        if (checkEmail) {
          throw new Error('This email address already registred');
        }

        const checkUsername = await models.User.findOne({ userName: userName });
        if (checkUsername) {
          throw new Error('User already exists');
        }

        // ===========================
        // TODO: Validation
        // ===========================

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await models.User.create({
          userName: userName,
          email: email,
          password: hashedPassword,
          trainer: trainer,
          location: location,
          telegram: telegram,
        });

        const payload = {
          id: user.id,
          roles: user.roles,
        };

        const emailToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: TOKEN_EXPIRY,
        });

        const url = `${process.env.FRONTEND_URL}/confirm/${emailToken}`;

        transporter.sendMail({
          from: 'noreply@pokego.now.sh',
          to: email,
          subject: 'Подтвердите почту',
          html: `<div><p>Нажмите на ссылку, чтобы подтвердить ваш адрес:</p><p><a href="${url}">Подтвердить адрес</a></p></div>`,
        });

        return { ...user._doc, password: null, id: user.id };
      } catch (error) {
        throw error;
      }
    },
    login: async (_parent, { input: { email, password } }, { models }) => {
      try {
        const user = await models.User.findOne({ email: email });
        if (!user) {
          throw new Error('Invalid credentials');
        }

        if (!user.confirmed) {
          throw new Error(
            `Please confirm your email first ${process.env.FRONTEND_URL}/confirm`
          );
        }

        const hashedPassword = await bcrypt.compare(password, user.password);
        if (!hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const payload = {
          id: user.id,
          roles: user.roles,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: TOKEN_EXPIRY,
        });

        return {
          userId: user.id,
          userName: user.userName,
          token: token,
          tokenExpiration: 1,
        };
      } catch (error) {
        throw error;
      }
    },
    confirmResend: async (_parent, { email }, { models }) => {
      try {
        // Check if User exists
        const user = await models.User.findOne({ email: email });
        if (!user) {
          throw new Error('Account not found');
        }

        // Check if User already confirmed
        if (user.confirmed) {
          throw new Error('Account already confirmed');
        }

        const payload = {
          id: user.id,
          roles: user.roles,
        };

        const emailToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: TOKEN_EXPIRY,
        });

        const url = `${process.env.FRONTEND_URL}/confirm/${emailToken}`;

        transporter.sendMail({
          from: 'noreply@pokego.now.sh',
          to: email,
          subject: 'Подтвердите почту',
          html: `<div><p>Нажмите на ссылку, чтобы подтвердить ваш адрес:</p><p><a href="${url}">Подтвердить адрес</a></p></div>`,
        });

        return true;
      } catch (error) {
        throw error;
      }
    },
    resetPasswordRequest: async (_parent, { email }, { models }) => {
      try {
        // Check if User exists
        const user = await models.User.findOne({ email: email });
        if (!user) {
          throw new Error('Account not found');
        }

        if (!user.confirmed) {
          throw new Error(
            `Please confirm your email first ${process.env.FRONTEND_URL}/confirm`
          );
        }

        const payload = {
          id: user.id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_PASSWORD_RESET, {
          expiresIn: RESET_PASSWORD_TOKEN_EXPIRY,
        });
        const tokenExpiry = Date.now() + RESET_PASSWORD_TOKEN_EXPIRY;

        await models.User.findOneAndUpdate(
          { _id: user.id },
          { passwordResetToken: token, passwordResetTokenExpiry: tokenExpiry },
          { new: true }
        );

        const url = `${process.env.FRONTEND_URL}/reset/${token}`;

        transporter.sendMail({
          from: 'noreply@pokego.now.sh',
          to: email,
          subject: 'Восстановление пароля',
          html: `<div><p>Нажмите на ссылку, чтобы изменить ваш пароль:</p><p><a href="${url}">Изменить пароль</a></p></div>`,
        });

        return true;
      } catch (error) {
        throw error;
      }
    },
    verifyResetPasswordRequest: async (_parent, { token, password }, { models }) => {
      try {
        const authUser = await jwt.verify(
          token,
          process.env.JWT_SECRET_PASSWORD_RESET
        );
        if (!authUser) {
          throw new Error('Unathorized. Try to reset password again');
        }

        // Find User
        const user = await models.User.findOne({
          _id: authUser.id,
          passwordResetToken: token,
          passwordResetTokenExpiry: {
            $gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRY,
          },
        });
        if (!user || authUser.id !== user.id) {
          throw new Error('Unathorized. Try to reset password again');
        }

        // ===========================
        // TODO: Password validation
        // ===========================
        const validatedPassword = password;
        const hashedPassword = await bcrypt.hash(validatedPassword, 12);

        await models.User.findByIdAndUpdate(
          { _id: authUser.id },
          {
            password: hashedPassword,
            $unset: { passwordResetToken: '', passwordResetTokenExpiry: '' },
          }
        );

        const payload = {
          id: user.id,
          roles: user.roles,
        };

        const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: TOKEN_EXPIRY,
        });

        return {
          userId: user.id,
          userName: user.userName,
          token: authToken,
          tokenExpiration: 1,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

export default userResolver;
