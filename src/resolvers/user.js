import {} from 'dotenv/config';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

import { user } from './merge';

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
          expiresIn: '24h',
        });

        const url = `http://localhost:3000/confirm/${emailToken}`;

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

        const hashedPassword = await bcrypt.compare(password, user.password);
        if (!hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const payload = {
          id: user.id,
          roles: user.roles,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '1h',
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
          expiresIn: '24h',
        });

        const url = `http://localhost:3000/confirm/${emailToken}`;

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
  },
};

export default userResolver;
