import axios from "axios";
import { HttpException } from "../middlewares/exceptions.js";
import { Redis } from "./redis.js";
import jwt from "jsonwebtoken";

export const checkUser = async (req, next) => {
  try {
    if (!req.headers["authorization"]) {
      return next(new HttpException(401, "Unauthorized"));
    }
    const authHeader = req.headers["authorization"].split("Bearer ")[1];
    if (!authHeader || authHeader === "") {
      return next(new HttpException(401, "Unauthorized"));
    }
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
    const user = await getUser(decoded.uid);
    if (!user) {
      return next(new HttpException(401, "Unauthorized"));
    }
    req.user = user;
  } catch (error) {
    return next(new HttpException(401, "Unauthorized"));
  }
};

const getUser = async (id) => {
  try {
    const redisKey = `Authorized_${id}`;
    const cache = await Redis.get(redisKey);
    if (cache) {
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
};

export const checkSource = async (req, next) => {
  try {
    const sourceId = req.headers["x-source"];
    const source = await getSource(sourceId);
    if (!source) {
      return next(new HttpException(401, "Unauthorized"));
    }
    if (!req.headers["authorization"]) {
      return next(new HttpException(401, "Unauthorized"));
    }
    const authHeader = req.headers["authorization"].split("Bearer ")[1];
    if (!authHeader || authHeader === "") {
      return next(new HttpException(401, "Unauthorized"));
    }
    const decoded = jwt.verify(authHeader, source.clientSecret);
    if (decoded.uid !== sourceId) {
      return next(new HttpException(401, "Unauthorized"));
    }
    req.source = source;
  } catch (error) {
    return next(new HttpException(401, "Unauthorized"));
  }
};

const getSource = async (id) => {
  try {
    const redisKey = `Authorized_Source_${id}`;
    const cache = await Redis.get(redisKey);
    if (cache) {
      return cache;
    }
    const resp = await axios
      .get(process.env.CONSENT_SERVICE + "/sources/" + id)
      .then((res) => res.data);
    await Redis.set(redisKey, resp.data);
    return resp.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
