import { cleanEnv, str, port } from 'envalid';

export const envalidate = () => {
  return cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'test', 'production', 'staging'],
    }),
    PORT: port(),
    DB_URL: str(),
    REDIS_URL: str(),
    REDIS_PORT: port(),
    FRONT_END_URL: str(),
    KAFKA_URL: str(),
  });
};
