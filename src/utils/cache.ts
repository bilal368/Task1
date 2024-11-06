import Redis from 'redis';
import { promisify } from 'util';
import { Request, Response, NextFunction } from 'express';

const client = Redis.createClient({
    url: `redis://localhost:${process.env.REDIS_PORT || '6379'}`
  });
export const getCache = promisify(client.get).bind(client);
export const setCache = promisify(client.setEx).bind(client);

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    getCache(req.originalUrl).then((data: any) => {
    if (data) return res.json(JSON.parse(data));
    next();
  });
};

export const cacheResponse = (key: string, value: any, seconds: number) => {
  setCache(key, seconds, JSON.stringify(value));
};
