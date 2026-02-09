import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './Modules/Shared/all-exceptions.filter';
import { TransformInterceptor } from './Modules/Shared/transform.interceptor';
import { TimeoutInterceptor } from './Modules/Shared/timeout.interceptor';
import { ResponseTimeInterceptor } from './Modules/Shared/response-time.interceptor';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalInterceptors(new ResponseTimeInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Automatically serialize entities to DTOs and exclude sensitive fields
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,                    // Automatically transform incoming data into DTO instances
      whitelist: true,                    // Remove non-whitelisted properties
      forbidNonWhitelisted: true,         // Reject requests with non-whitelisted properties
      skipMissingProperties: true,        // Skip validation for missing properties
      disableErrorMessages: false,        // Enable detailed error messages (disable in production)
      validationError: { target: true },  // Include the original object in validation errors (disable in production)
    })
  );
  
  app.useLogger(app.get(Logger));         // pino logger for structured logging
  app.use(helmet());                      // Helmet helps secure your app by setting various HTTP headers
  app.use(compression());                 // Compression middleware to reduce the size of the response body and improve the speed of web applications
  
  // Enabling CORS for only the front-end origin and specific HTTP methods
  app.enableCors({
    // origin: '5000',
    // methods: 'GET,HEAD,PUT,POST,DELETE',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
