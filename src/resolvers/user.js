import User from '../models/user';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
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
    login: async ({ email, password }) => {},
  },
  Mutation: {
    createUser: async (parent, args, context, info) => {
      try {
        const existingUser = await User.findOne({ email: args.input.email });
        if (existingUser) {
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

        // const url = `http://localhost:3000/confirm/${emailToken}`;

        // transporter.sendMail({
        //   from: 'noreply@pokego.now.sh',
        //   to: args.input.email,
        //   subject: 'Подтвердите почту',
        //   html: `Нажмите на ссылку, чтобы подтвердить ваш адрес <a href="${url}">${url}</a>`,
        // });

        return { ...result._doc, password: null, id: user.id };
      } catch (error) {
        throw error;
      }
    },
  },
};

export default userResolver;
