import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import compress from "compression";
import {createServer} from "http";
import {Server, Socket} from "socket.io";
import express, {Response, Request} from "express";
import {PrismaClient} from "@prisma/client";

dotenv.config();
const app = express();
const port = process.env.PORT || 3300;
export const prisma = new PrismaClient();

import initRoutes from "./src/routes/init";
// import authRoutes from "./src/routes/auth";
import getCodeRoutes from "./src/routes/geoCode";
import locMetricsRoutes from "./src/routes/locmetrics";
import userReviewRoutes from "./src/routes/userReviews";
import {ChatMessage} from "./src/@types/ChatMessage";
import {authToken} from "./src/middleware/auth";
import {CustomRequest} from "./src/@types/express";

app.use(compress());
app.use(
  cors({origin: process.env.CLIENT_ORIGIN as string, credentials: true})
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cookieParser());

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {origin: process.env.CLIENT_ORIGIN as string,credentials: true ,methods: ["GET", "POST"]},
});

app.use("/init", authToken, initRoutes);
// app.use("/auth", authRoutes);
app.use("/geo", authToken, getCodeRoutes);
app.use("/metrics", locMetricsRoutes);
app.use("/reviews", authToken, userReviewRoutes);

app.use("/", (req: Request, res: Response) => {
  res.status(200).send({
    status: 200,
    message: "Sentinel Safe API is working fine!",
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    url: req.url,
    headers: req.headers,
    cookies: req.cookies,
  });
});

io.on("connection", (socket: Socket) => {
  socket.on("user-joined", (name: string) => {
    io.emit("user-joined", name);
  });

  socket.on("chatMessage", (message: ChatMessage, socketId: string) => {
    console.log({message, socketId});
    io.except(socketId).emit("chatMessage", {
      text: message.text,
      userName: message.userName,
    });
  });

  socket.on("disconnect", () => {
    console.log("someone disconnected");
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err: Error, req: CustomRequest, res: Response) => {
  console.error(err);
  res.status(500).send({message: "Something Broke!"});
});

export default app;
