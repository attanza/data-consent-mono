import { cleanEnv, str, port } from "envalid";

export const envalidate = () => {
  return cleanEnv(process.env, {
    PORT: port(),
    JWT_SECRET: str(),
    AUTH_SERVICE: str(),
  });
};
