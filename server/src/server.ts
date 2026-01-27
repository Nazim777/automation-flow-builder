import { connectDB } from "./config";
import { server, io } from "./app/app";
import { CronJobs } from "./utils/cron";
const HOST: string =
  process.env.NODE_ENV === "production"
    ? String(process.env.HOST || "0.0.0.0")
    : "localhost";
const PORT: number = Number(process.env.PORT || 8080);
const DB_URI: string =
  process.env.NODE_ENV === "production"
    ? String(process.env.MONGO_URI)
    : String(process.env.MONGO_URI);

// start the cron job
CronJobs.start();

// DB Connection and server Listening.
connectDB(DB_URI)
  .then(() => {
    console.log("------ Database is connected! -------");
    server.listen(PORT, () => {
      console.log(`Welcome to -- ${process.env.APP_NAME} -- `);
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.log("ERR! Can't Connect to Database! --> ", error.message);
    server.close(() => {
      console.log("Server is closed");
      process.exit(1);
    });
  });
