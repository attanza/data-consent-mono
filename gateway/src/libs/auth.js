import axios from "axios";
import { expressjwt } from "express-jwt";
import { HttpException } from "../middlewares/exceptions.js";
import { Redis } from "../utils/redis.js";
export const setupAuth = (app, routes) => {
  routes.forEach((r) => {
    if (r.auth) {
      app.use(
        r.url,
        expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
        async function (req, _, next) {
          if (!req.auth) {
            return next(new HttpException(401, "Unauthorized"));
          }
          const { uid } = req.auth;
          const user = await getUser(uid);
          req.user = user;
          next();
        }
      );
    }
  });
};

async function getUser(id) {
  try {
    const redisKey = `Authorized_${id}`;
    const cache = await Redis.get(redisKey);
    if (cache) {
      console.log("get user from cache");
      return cache;
    }
    const resp = await axios
      .get(process.env.AUTH_SERVICE + "/users/" + id)
      .then((res) => res.data);
    await Redis.set(redisKey, resp.data);
    return resp.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
