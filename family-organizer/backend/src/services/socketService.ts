import { Server } from 'socket.io';
import logger from '../utils/logger';

export const setupSocketIO = (io: Server) => {
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    // Chat events
    socket.on('send_message', (data) => {
      io.emit('new_message', data);
    });
  });

  return io;
};
