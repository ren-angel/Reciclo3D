import { Injectable, Inject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminRepositoryInterface } from '../../Domain/Repositories/admin.repository.interface';
// import { CacheService } from "src/Modules/Shared/cache.service";
import { UnauthorizedError } from 'src/Modules/Shared/custom-errors.exception';

// ATTENTION: Turn ON verification code again by making it non-nullable here and on database, and then apply it to the jwt and admin logins parts of this code
// Things to cache and implement later: refresh tokens (7 days ttl), and the key should be something like refresh:{sessionId} where sessionId is a unique identifier for the login session. The value stored should include the userId, hashedRefreshToken, deviceInfo, and issuedAt timestamp. This way, when a refresh token is presented, we can verify it against the stored hashed token and also check if it's still valid based on the issuedAt timestamp and device info.
// refresh:{sessionId} → {
//   userId,
//   hashedRefreshToken,
//   deviceInfo,
//   issuedAt
// }
// Logins attempts to prevent brute-force attacks
// login:attempts:{ip}
// login:attempts:{userId}


// Use case for handling user login and generating JWT tokens upon successful authentication
@Injectable()
export class AdminLoginUseCase {

    // Injecting the Admin repository and JWT service using dependency injection for the use case to interact with the data layer and generate JWT tokens
    constructor(
        @Inject('AdminRepositoryInterface')
        private readonly adminRepository: AdminRepositoryInterface,
        private readonly jwtService: JwtService,
        // private readonly cacheService: CacheService,
        private readonly logger: Logger,
    ) {}
  
    // Method to execute the use case, taking an admin email and password as input, validating the credentials against the repository, and returning a Promise that resolves to an object containing the generated JWT access token if authentication is successful
    async execute(adminEmail: string, adminPassword: string): Promise<{ access_token: string }> {

        this.logger.log('Fetching user from repository...');

        // Validate the admin credentials by checking if a user with the provided email and password exists in the repository
        const existingUser = await this.adminRepository.findOne(adminEmail, adminPassword);

        // If no user is found with the provided credentials, throws an unauthorized error
        if (!existingUser) {

            throw new UnauthorizedError('Credenciais inválidas. Por favor, verifique seu email e senha.');
        }

        this.logger.log('User found. Creating payload for access token...');
        
        // If the credentials are valid, generate a JWT token with the admin's email and password as the payload. The 'sub' claim is commonly used to identify the subject of the token, which in this case is the admin's ID
        const payload = {
            sub: existingUser.adminId,
            adminEmail: existingUser.adminEmail,
            roles: ['admin']
        };

        // Return the generated JWT token in the response
        return { access_token: this.jwtService.sign(payload) };
    }
}