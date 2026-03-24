import Redis from "ioredis";
import { config } from "./config";

// console.log("REDIS HOST:", config.REDIS_HOST);
// console.log("REDIS PORT:", config.REDIS_PORT);
// export const redis = new Redis({
//     // host: "localhost",
//     // port: 6379
//     host: config.REDIS_HOST,
//     port: config.REDIS_PORT
// })
// // console.log(config.REDIS_URI);

export const redis = new Redis(config.REDIS_URI)


redis.on("connect",()=>{
    console.log("Redis connected");   
})

redis.on("error", (err) => {
  console.error("Redis error:", err);
});