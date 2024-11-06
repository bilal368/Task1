import { buildSchema } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/user';
import { cacheResponse } from './utils/cache';

export const schema = buildSchema(`
  type User {
    id: ID!
    username: String!
    email: String!
  }
  
  type Query {
    users: [User!]!
    user(id: ID!): User
  }
  
  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String
  }
`);

export const root = {
  users: async () => {
    const users = await User.findAll();
    cacheResponse('users', users, 60 * 5); // Cache for 5 minutes
    return users;
  },
  user: async ({ id }: { id: number }) => User.findByPk(id),
  register: async ({ username, email, password }: { username: string, email: string, password: string }) => {
    const hash = await bcrypt.hash(password, 10);
    return User.create({ username, email, password: hash });
  },
  login: async ({ email, password }: { email: string, password: string }) => {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) throw new Error('Invalid credentials');

    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  }
};
