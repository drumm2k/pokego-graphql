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
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      try {
        const checkEmail = await User.findOne({ email: args.input.email });
        if (checkEmail) {
          throw new Error('This email address already registred.');
        }

        const checkUsername = await User.findOne({ userName: args.input.userName });
        if (checkUsername) {
          throw new Error('User already exists.');
        }

        const hashedPassword = await bcrypt.hash(args.input.password, 12);

        const user = new User({
          userName: args.input.userName,
          email: args.input.email,
          password: hashedPassword,
          trainer: args.input.trainer,
          location: args.input.location,
          telegram: args.input.telegram,
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
          to: args.input.email,
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
    },
  },
};

export default userResolver;
