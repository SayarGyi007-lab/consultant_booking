import dotenv from "dotenv";

if (process.env.NODE_ENVIRONMENT !== "production") {
  dotenv.config();
}

class Config {

    public DATABASE_URL: string;
    public DATABASE_URL_PRODUCTION: string;
    public JWT_SECRET: string;

    public POSTGRES_USER: string;
    public POSTGRES_PASSWORD: string;
    public POSTGRES_DB: string;

    public ACCESS_TOKEN: string;
    public REFRESH_TOKEN: string;
    public CLIENT_URL: string;

    public PORT: number;
    public NODE_ENVIRONMENT: string;
    public JWT_REFRESH_SECRET: string;

    public ADMIN_PASSWORD: string;
    public ADMIN_EMAIL: string;

    public REDIS_HOST: string;
    public REDIS_PORT: number;

  constructor() {
    if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

    this.REDIS_HOST = process.env.REDIS_HOST || "localhost";
    this.REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

    this.DATABASE_URL = process.env.DATABASE_URL || "";
    this.DATABASE_URL_PRODUCTION = process.env.DATABASE_URL_PRODUCTION || "";

    this.JWT_SECRET = process.env.JWT_SECRET || "";
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || ""

    this.POSTGRES_USER = process.env.POSTGRES_USER || "";
    this.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "";
    this.POSTGRES_DB = process.env.POSTGRES_DB || "";

    this.ACCESS_TOKEN = process.env.ACCESS_TOKEN || "";
    this.REFRESH_TOKEN = process.env.REFRESH_TOKEN || "";

    this.CLIENT_URL = process.env.CLIENT_URL || "";

    this.PORT = Number(process.env.PORT) || 4000;

    this.NODE_ENVIRONMENT = process.env.NODE_ENVIRONMENT || "development";

    this.ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
    this.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
  }
}

export const config = new Config();