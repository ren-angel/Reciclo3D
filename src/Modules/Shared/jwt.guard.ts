import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

// JWT Authentication Guard
@Injectable()
export class JwtAuthGuard implements CanActivate {

    // Inject JwtService and Reflector, used for verifying JWT tokens
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    // Method to determine if the request can proceed based on JWT validation
    canActivate(context: ExecutionContext): boolean {

        // Check if the route is marked as public using the custom decorator
        // Here, use reflector to get the metadata set by the Public decorator on the controller
        // getAllAndOverride checks both the handler and the class for the metadata, allowing for flexible use of the Public decorator
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        // If the route is public, allow access without JWT validation
        if (isPublic) {
            return true;
        }

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