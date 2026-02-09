import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Actor as ActorType } from './actor.interface';

// JWT Strategy for validating JWT tokens and extracting user information
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    // Inject ConfigService to access environment variables, such as the secret key for JWT. No make it private since other classes need to access it.
    constructor(readonly configService: ConfigService) {

        // Call the super constructor to configure the JWT strategy with options
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('SECRET_KEY'),
        });
    }

    // Method to validate the JWT payload and return the corresponding Actor object
    async validate(payload: any) {
        
        return { 
            id: payload.sub,
            email: payload.adminEmail,
            roles: payload.roles
         } as ActorType;
    }
}