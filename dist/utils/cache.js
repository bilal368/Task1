"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheResponse = exports.cacheMiddleware = exports.setCache = exports.getCache = void 0;
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
const client = redis_1.default.createClient({
    url: `redis://localhost:${process.env.REDIS_PORT || '6379'}`
});
exports.getCache = (0, util_1.promisify)(client.get).bind(client);
exports.setCache = (0, util_1.promisify)(client.setEx).bind(client);
const cacheMiddleware = (req, res, next) => {
    (0, exports.getCache)(req.originalUrl).then((data) => {
        if (data)
            return res.json(JSON.parse(data));
        next();
    });
};
exports.cacheMiddleware = cacheMiddleware;
const cacheResponse = (key, value, seconds) => {
    (0, exports.setCache)(key, seconds, JSON.stringify(value));
};
exports.cacheResponse = cacheResponse;
