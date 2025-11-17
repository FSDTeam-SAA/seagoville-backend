import http from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import { Server } from "socket.io";
import { initNotificationSocket } from "./socket/notification.service";

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mogodbUrl as string);
    console.log(" MongoDB connected");
    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: "*", // or your frontend URL
        methods: ["GET", "POST"],
      },
    });


    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      socket.on("joinRoom", (userId) => socket.join(userId));
    });

    initNotificationSocket(io);

    httpServer.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
}

main();
