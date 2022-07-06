import { checkUser, checkSource } from "../utils/authUtils.js";
export const setupAuth = (app, routes) => {
  routes.forEach((r) => {
    if (r.auth) {
      app.use(r.url, async function (req, _, next) {
        if (req.headers["x-source"]) {
          console.log("source check");
          await checkSource(req, next);
        } else {
          console.log("user check");
          await checkUser(req, next);
        }
        next();
      });
    }
  });
};
