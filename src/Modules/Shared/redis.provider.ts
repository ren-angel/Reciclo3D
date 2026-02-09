import { Provider } from '@nestjs/common'; // Provider interface from NestJS for defining custom providers, with providers being a fundamental part of NestJS's dependency injection system
import Redis from 'ioredis';
import Redlock from 'redlock';

// Provider for the Redis client without the cache manager internal one for ioredis client usage
export const RedisClientProvider: Provider = {
  provide: 'REDIS_RAW',
  useFactory() {
      return new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD,
    });
  },
};

// Provider for the RedLock instance, which is used for distributed locking with Redis
export const RedlockProvider: Provider = {
  provide: 'REDIS_LOCK',
  inject: ['REDIS_RAW'],
  useFactory: (redisClient) => {
    return new Redlock([redisClient], {
      retryCount: 5,        // Number of times to retry acquiring the lock before failing
      retryDelay: 200,      // Time in milliseconds to wait between retries
    });
  },
};