import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import { notFoundMiddleware, errorHandlerMiddleware } from "./error";
import middleware from "./middleware";
import routes from "./routes";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

// Apply general middleware
app.use(middleware);

// Initialize Socket.IO and Attach to `req`
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// Middleware to attach `io` before routes execute
app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as any).io = io;
  next();
});

// Load routes after attaching io
app.use(routes);

// Error handling middleware
app.use("*", notFoundMiddleware);
app.use(errorHandlerMiddleware);

export { server, io };
