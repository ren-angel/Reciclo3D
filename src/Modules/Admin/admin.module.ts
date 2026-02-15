import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AdminEntity } from './Domain/Entities/admin.entity';
import { JwtStrategy } from '../Shared/jwt.strategy';
import { AdminController } from './Interfaces/Controllers/admin.controller';
import { AdminLoginUseCase } from './Application/Use-cases/login.use-case';

// Module definition for the Admin of the application
@Module({
  imports: [
    PassportModule, // Importing PassportModule to handle authentication strategies
    TypeOrmModule.forFeature([AdminEntity]), // Importing TypeOrmModule with AdminEntity for database operations
      
    // Configuring the JwtModule asynchronously to use environment variables for the secret key and token expiration
    JwtModule.registerAsync({

      // expiresIn should be short, like 1 hour, to minimize the risk of token theft. For longer sessions, implement refresh tokens (see login.use-case.ts)
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
      
      // Injecting ConfigService to access environment variables for JWT configuration
      inject: [ConfigService],
    }),  
  ],
  providers: [JwtStrategy, AdminLoginUseCase], // Registering the JwtStrategy for validating JWT tokens and the AdminLoginUseCase for handling login logic
  controllers: [AdminController], // Registering the AdminController to handle incoming HTTP requests related to admin operations
  exports: [JwtModule], // Exporting JwtModule to make it available for other modules that import AuthModule, allowing them to use JWT functionalities such as signing and verifying tokens
})

export class AdminModule {}
