import { compare, hash } from 'bcryptjs';
import {} from 'dotenv/config';
import { sign, verify } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { createAccessToken, createRefreshToken } from '../auth';
import { sendRefreshToken } from '../sendRefreshToken';
import { user } from './merge';

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
    hello: async (_parent, _args, { user }) => {
      if (!user) {
        throw new Error('Unathorized');
      }

      return 'hi';
    },
    getUser: async (_parent, { userName }, { models }) => {
      try {
        const userData = await models.User.findOne({ userName: userName });
        return user(userData);
      } catch (error) {
        throw error;
      }
    },
    me: async (_parent, _args, { models, user }) => {
      const userData = await models.User.findById(user.userId);
      userData.password = '';
      return userData;
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
        const authUser = await verify(token, process.env.JWT_SECRET);
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
      const {
        userName,
        email,
        password,
        subscription,
        trainer,
        location,
        social,
      } = input;
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

        const hashedPassword = await hash(password, 12);

        const user = await models.User.create({
          userName: userName,
          email: email,
          password: hashedPassword,
          subscription: subscription,
          trainer: trainer,
          location: location,
          social: social,
        });

        const payload = {
          id: user.id,
          roles: user.roles,
        };

        const emailToken = sign(payload, process.env.JWT_SECRET, {
          expiresIn: '8h',
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
    login: async (_parent, { input: { email, password } }, { models, res }) => {
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

        const hashedPassword = await compare(password, user.password);
        if (!hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const accessToken = createAccessToken(user);
        sendRefreshToken(res, createRefreshToken(user));

        user.password = '';

        return {
          accessToken: accessToken,
          user: user,
        };
      } catch (error) {
        throw error;
      }
    },
    logout: async (_parent, _args, { res }) => {
      sendRefreshToken(res, '');
      return true;
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

        const emailToken = sign(payload, process.env.JWT_SECRET, {
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

        const token = sign(payload, process.env.JWT_RESET_SECRET, {
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
        const authUser = await verify(token, process.env.JWT_RESET_SECRET);
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
        const hashedPassword = await hash(validatedPassword, 12);

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

        const authToken = sign(payload, process.env.JWT_SECRET, {
          expiresIn: '8h',
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
