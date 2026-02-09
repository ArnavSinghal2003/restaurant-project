export function initializeSocket(io) {
  io.on('connection', (socket) => {
    socket.on('table:join', ({ tableSessionId }) => {
      if (!tableSessionId) return;
      socket.join(`table:${tableSessionId}`);
    });

    socket.on('table:leave', ({ tableSessionId }) => {
      if (!tableSessionId) return;
      socket.leave(`table:${tableSessionId}`);
    });

    socket.on('disconnect', () => {
      // Reserved for connection telemetry in Phase 3+
    });
  });
}
