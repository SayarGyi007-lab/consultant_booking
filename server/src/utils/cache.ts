import { redis } from "../config/redis";


// Get cache
export const getCache = async (key: string) => {
  try {
    const data = await redis.get(key);

    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.error("Redis GET error:", error);
    return null; // fail safely (don’t break app)
  }
};

// Set cache
export const setCache = async (
  key: string,
  value: any,
  ttl: number = 60 // default 60 seconds
) => {
  try {
    await redis.set(key, JSON.stringify(value))
    await redis.expire(key,ttl)
  } catch (error) {
    console.error("Redis SET error:", error);
  }
};