import { io, type Socket } from "socket.io-client";

// The Socket.IO server is attached to the same HTTP server as the Next.js
// app (see uDrive-backend/server.ts), listening at the origin root — not
// under /api like the REST endpoints.
const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/api\/?$/, "");

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
