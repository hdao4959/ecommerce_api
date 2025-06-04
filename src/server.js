import express from 'express';
import cors from 'cors';
import { connectDb } from './config/mongodb.js';
import env from './config/env.js';
import Router_V1 from './routes/v1/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))


connectDb().then(() => {
  app.use('/api/v1', Router_V1)
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    console.log(`Server is starting on: http://localhost:${env.PORT}`);
  })
},



)