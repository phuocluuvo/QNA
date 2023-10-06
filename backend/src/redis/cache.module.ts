import { Module } from "@nestjs/common";
import { CacheModule, CacheStore } from "@nestjs/cache-manager";
import { RedisStore, redisStore } from "cache-manager-redis-store";
import { redisConfig } from "../config/redis.config";
import type { RedisClientOptions } from "redis";

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: async () => {
        const store: RedisStore = await redisStore({
          socket: redisConfig,
        });
        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
  ],
})
export class RedisCacheModule {}
