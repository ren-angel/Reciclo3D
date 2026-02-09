import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// JWT Authentication Guard
@Injectable()
export class JwtAuthGuard implements CanActivate {

    // Inject JwtService and Reflector, used for verifying JWT tokens
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    // Method to determine if the request can proceed based on JWT validation
    canActivate(context: ExecutionContext): boolean {

        // Extract the HTTP request from the execution context
        const request = context.switchToHttp().getRequest<Request>();

        // Get the Authorization header and extract the token
        const token = request.headers.authorization?.split(' ')[1];

        // If no token is present, deny access
        if (!token) return false;

        try {

            // Verify the token and decode its payload
            const decoded = this.jwtService.verify(token);

            // Attach the decoded user information to the request object
            request['user'] = decoded;
            
            return true;
        } catch {

            // If token verification fails, deny access
            return false;
        }
    }
}