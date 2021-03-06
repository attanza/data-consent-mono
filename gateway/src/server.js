import "dotenv/config";
import express from "express";
import { setupLogging } from "./libs/logging.js";
import { setupProxies } from "./libs/proxy.js";
import { ROUTES } from "./libs/routes.js";
import { setupAuth } from "./libs/auth.js";
import { setupRateLimit } from "./libs/ratelimit.js";
import { envalidate } from "./utils/envalidate.js";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
const app = express();
const port = process.env.PORT;
envalidate();
app.use(helmet());
app.disable("x-powered-by");
app.use(cors());
app.use(compression());
setupLogging(app);
setupRateLimit(app, ROUTES);
setupAuth(app, ROUTES);
setupProxies(app, ROUTES);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
