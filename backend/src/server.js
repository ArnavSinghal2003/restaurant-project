import http from 'http';
import { Server } from 'socket.io';

import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { initializeSocket } from './sockets/index.js';

async function startServer() {
  await connectDatabase();

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true
    }
  });

  initializeSocket(io);

  httpServer.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `Port ${env.PORT} is already in use. Update PORT in backend/.env to a free port (example: 5001).`
      );
      process.exit(1);
    }

    console.error('HTTP server failed to start:', error);
    process.exit(1);
  });

  httpServer.listen(env.PORT, () => {
    console.log(`Backend listening on port ${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend server:', error);
  process.exit(1);
});
