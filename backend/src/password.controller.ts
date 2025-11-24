import { Controller, Post, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PasswordService } from './password.service';

@Controller('api/password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  /**
   * Endpoint to store a password
   * Returns a unique ID for the generated link
   */
  @Post('store')
  storePassword(@Body('password') password: string) {
    if (!password || typeof password !== 'string') {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    const id = this.passwordService.storePassword(password);

    return {
      id,
      success: true,
    };
  }

  /**
   * Endpoint to retrieve a password
   * Password is deleted after retrieval
   */
  @Get('retrieve/:id')
  retrievePassword(@Param('id') id: string) {
    const password = this.passwordService.retrievePassword(id);

    if (!password) {
      throw new HttpException(
        'Password not found or already retrieved',
        HttpStatus.NOT_FOUND
      );
    }

    return {
      password,
      success: true,
    };
  }

  /**
   * Health check endpoint
   */
  @Get('health')
  health() {
    return {
      status: 'ok',
      storedPasswords: this.passwordService.getStorageSize(),
    };
  }
}
