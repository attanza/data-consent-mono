import { cleanEnv, str, port } from 'envalid';

export const envalidate = () => {
  return cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'test', 'production', 'staging'],
    }),
    PORT: port(),
    MINIO_ENDPOINT: str(),
    MINIO_PORT: str(),
    MINIO_ACCESS_KEY: str(),
    MINIO_SECRET_KEY: str(),
    MINIO_BUCKET_NAME: str(),
    FRONT_END_URL: str(),
    KAFKA_URL: str(),
  });
};
