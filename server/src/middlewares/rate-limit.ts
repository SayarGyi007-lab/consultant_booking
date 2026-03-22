import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { AuthRequest } from "./authentication";
import RedisStore, { RedisReply } from "rate-limit-redis";
import { redis } from "../config/redis";

const keyGenerator = (req: AuthRequest) =>{
    return req.user?.id ?? ipKeyGenerator(req.ip as string)
}

export const globalLimiter = rateLimit({
    store: new RedisStore({
		sendCommand: (command: string, ...args: string[]) =>
			redis.call(command, ...args) as Promise<RedisReply>,
	}),
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
})
