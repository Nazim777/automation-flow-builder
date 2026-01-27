import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

// Cors Config ---
const corsConfig: cors.CorsOptions = {
  credentials: true,
  origin: "https://automation-flow-builder-sage.vercel.app", // Explicitly allow the frontend origin
};

const middleware: any = [morgan("dev"), cors(corsConfig), bodyParser.json()];

export default middleware;
