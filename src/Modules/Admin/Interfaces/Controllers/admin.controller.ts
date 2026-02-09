import { Controller, Post, Body } from '@nestjs/common';
import { seconds, Throttle } from '@nestjs/throttler';
import { AdminLoginUseCase } from '../../Application/Use-cases/login.use-case';

const URL_PATH = `admin/${process.env.ADMIN_URL}`; // The URL is intentionally obfuscated to enhance security by making it less discoverable by bots.

// Controller for handling admin-related endpoints, such as login
@Controller(URL_PATH)
@Throttle({ default: { limit: 10, ttl: seconds(60) } }) // Overriding the default throttling for this specific controller
export class AdminController {

  constructor(private adminLoginUseCase: AdminLoginUseCase) {}

  // Endpoint for admin login, which accepts an email and password in the request body, and returns a JWT access token if the credentials are valid
  @Post('login')
  async login(@Body() loginDto: { adminEmail: string; adminPassword: string }): Promise<{ access_token: string }> {

    console.log('url: ', URL_PATH);
    
    return this.adminLoginUseCase.execute(loginDto.adminEmail, loginDto.adminPassword);
  }
}