import { Module, Global, Logger } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { RedisClientProvider, RedlockProvider } from "./redis.provider";

// Shared module providing common services like caching and Redis clients
@Global()
@Module({
    providers: [CacheService, RedisClientProvider, RedlockProvider, Logger],
    exports: [CacheService, RedisClientProvider, RedlockProvider, Logger],
})

export class SharedModule {}