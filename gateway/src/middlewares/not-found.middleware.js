import { HttpException } from "./exceptions.js";
export function notFoundMiddleware(_, __, next) {
  next(new HttpException(404, "Not Found"));
}
