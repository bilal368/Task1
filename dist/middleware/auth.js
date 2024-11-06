"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("../utils/cache");
// Example authenticateToken middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        // Your token verification logic here
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Forbidden' });
    }
};
// Example cacheMiddleware
const cacheMiddleware = (req, res, next) => {
    (0, cache_1.getCache)(req.originalUrl).then((data) => {
        if (data) {
            res.json(data);
        }
        else {
            next();
        }
    }).catch(() => next());
};
// const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Access denied' });
//   jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });
//     (req as any).user = user;
//     next();
//   });
// };
exports.default = authenticateToken;
