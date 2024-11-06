import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import dotenv from 'dotenv';
import sequelize from './config/db';
import { schema, root } from './schema';
import authenticateToken from './middleware/auth';
import { cacheMiddleware } from './utils/cache';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use('/graphql', authenticateToken, cacheMiddleware, graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
  console.error('Database connection error:', error);
});
