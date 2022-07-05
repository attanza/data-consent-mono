export function errorMiddleware(error, _, res, next) {
  const status = error.status || 500;
  let message = error.message || "Internal server error";
  console.log("error.name", error.name);
  if (error.name === "UnauthorizedError") {
    message = "Unauthorized";
  }
  res.status(status).send({
    meta: {
      status,
      message,
    },
  });
}
