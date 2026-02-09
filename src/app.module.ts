import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { BullModule } from '@nestjs/bullmq';
import { SharedModule } from './Modules/Shared/shared.module';
import { AboutModule } from './Modules/About/about.module';
import { AboutEntity } from './Modules/About/Domain/Entities/about.entity';

@Module({
  imports: [
    // Configures environment variables and validates them using Joi schema
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number().default(28325),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(16905),
        REDIS_USER: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
        ADMIN_URL: Joi.string().required(),
      })
    }),

    // Configures assincronous database connection of mySQL type and loads variables from .env file 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [AboutEntity],
        synchronize: true,
      }),
    }),

    // Configures API request throttling to limit the number of requests a client can make in a given time period
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(60), // time to live in seconds. 1 minute for all endpoints by default
          limit: 100 // max number of requests within the ttl. 100 requests per minute for all endpoints by default
        }
      ]
    }),

    // Configures logging using Pino (advanced logging) with pretty-printing for better readability during development
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
    }),

    // Configures caching with Redis and loads variables from .env file 
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        username: configService.get<string>('REDIS_USER'),
        password: configService.get<string>('REDIS_PASSWORD'),
      }),
      isGlobal: true,
    }),

    // Configures BullMQ for background job processing with Redis as the message broker and loads variables from .env file 
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          username: configService.get<string>('REDIS_USER'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      })
    }),
    // BullModule.registerQueue({
    //   name: 'emailQueue',
    // }),

    SharedModule,
    AboutModule,
  ],
  // providers: [emailProcessor],
  providers: [
    {
      provide: APP_GUARD,       // Global application guard for rate limiting using ThrottlerGuard
      useClass: ThrottlerGuard, // Applies the throttling rules defined in ThrottlerModule globally across all controllers
    },
  ],
})

export class AppModule {}
