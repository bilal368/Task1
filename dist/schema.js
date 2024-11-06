"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.root = exports.schema = void 0;
const graphql_1 = require("graphql");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("./models/user"));
const cache_1 = require("./utils/cache");
exports.schema = (0, graphql_1.buildSchema)(`
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
exports.root = {
    users: () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield user_1.default.findAll();
        (0, cache_1.cacheResponse)('users', users, 60 * 5); // Cache for 5 minutes
        return users;
    }),
    user: (_a) => __awaiter(void 0, [_a], void 0, function* ({ id }) { return user_1.default.findByPk(id); }),
    register: (_a) => __awaiter(void 0, [_a], void 0, function* ({ username, email, password }) {
        const hash = yield bcryptjs_1.default.hash(password, 10);
        return user_1.default.create({ username, email, password: hash });
    }),
    login: (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password)))
            throw new Error('Invalid credentials');
        return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    })
};
