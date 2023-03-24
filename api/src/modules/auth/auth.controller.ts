import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req) {
    return req.user;
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  @HttpCode(204)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(req.user);
    res.cookie('auth-cookie', token, { httpOnly: true });
  }

  @HttpCode(201)
  @Post('signup')
  async signUp(
    @Body() user: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signup(user);
    res.cookie('auth-cookie', token, { httpOnly: true });
  }
}
