import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Créer un compte utilisateur' })
  @ApiBody({
    schema: {
      example: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      },
    },
  })
  async signup(@Body() body: any) {
    try {
      return await this.authService.signup(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        password: 'securePassword123',
      },
    },
  })
  async login(@Body() body: any) {
    try {
      return await this.authService.login(body.email, body.password);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
