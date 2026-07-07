import 'dotenv/config';

const required = (name: string, value: string | undefined) => {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
};

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  MONGO_URI: required('MONGO_URI', process.env.MONGO_URI),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
};
