import express from 'express';
import cors from 'cors';
import { connectDb } from './config/mongodb.js';
import env from './config/env.js';
import Router_V1 from './routes/v1/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import path from 'path'
import { fileURLToPath } from 'url';
import http from 'http'
import { Server } from 'socket.io';
import tk from './utils/token.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:5176']
}));

const server = http.createServer(app)
export const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:5176'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export const onlineUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth.token

  if (!token) return
  try {
    const payload = tk.verifyToken(token, env.JWT_SECRET)
    socket.userId = payload.id
    socket.role = payload.role
    next()
  } catch (error) {
    next(error)
  }
})

io.on('connection', (socket) => {

  if(socket.role === 'admin'){
    onlineUsers.set(socket.userId, socket.id);
  }

  socket.on('disconnect', () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  })
})

connectDb().then(() => {
  app.use('/api/v1', Router_V1)
  app.use(errorHandler);

  server.listen(env.PORT, () => {
    console.log(`Server is starting on: http://localhost:${env.PORT}`);
  })
},



)