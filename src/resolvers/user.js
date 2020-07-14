import {} from 'dotenv/config';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

import User from '../models/user';
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
    getUser: async (parent, args, context, info) => {
      try {
        const userData = await User.findOne({ userName: args.userName });
        return user(userData);
      } catch (error) {
        throw error;
      }
    },
    getUsers: async () => {
      try {
        const usersData = await User.find();
        return usersData.map((userData) => {
          return user(userData);
        });
      } catch (error) {
        throw error;
      }
    },
    confirm: async (parent, args, context, info) => {
      const { token } = args;

      let status;
      try {
        const authUser = await jwt.verify(token, process.env.JWT_SECRET);
        if (authUser) {
          await User.findByIdAndUpdate({ _id: authUser.id }, { confirmed: true });
          status = true;
        }
      } catch (error) {
        throw new Error(error);
      }

      return { status: status };
    },
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      const { userName, email, password, trainer, location, telegram } = args.input;
      try {
        const checkEmail = await User.findOne({ email: email });
        if (checkEmail) {
          throw new Error('This email address already registred.');
        }

        const checkUsername = await User.findOne({ userName: userName });
        if (checkUsername) {
          throw new Error('User already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
          userName: userName,
          email: email,
          password: hashedPassword,
          trainer: trainer,
          location: location,
          telegram: telegram,
        });

        const result = await user.save();

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

        return { ...result._doc, password: null, id: user.id };
      } catch (error) {
        throw error;
      }
    },
    login: async (parent, args, context, info) => {
      const { email, password } = args.input;

      try {
        const user = await User.findOne({ email: email });
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

        return { id: user.id, token: token, tokenExpiration: 1 };
      } catch (error) {
        throw new Error(error);
      }
    },
    confirmResend: async (parent, args, context, info) => {
      const { email } = args;
      try {
        // Check if User exists
        const user = await User.findOne({ email: email });
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

        const status = true;
        return { status: status };
      } catch (error) {
        throw error;
      }
    },
  },
};

export default userResolver;
