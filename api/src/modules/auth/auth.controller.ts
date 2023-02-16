// check to see if express request and response object might be a better fit for the zwo api needs
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  findAll(@Req() request: Request) {
    console.log('Test Endpoint');
    console.log(request.cookies);
    return { message: 'Valid Token' };
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    // return await this.authService.login(req.user);
    let loginAnswer = await this.authService.login(req.user);
    if (loginAnswer.token) {
      res.cookie('auth-cookie', loginAnswer.token, { httpOnly: true });
      return loginAnswer.data;
    }
    return loginAnswer.error;
  }

  @Post('signup')
  async signUp(
    @Body() user: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    let signupAnswer = await this.authService.signup(user);
    if (signupAnswer.token) {
      res.cookie('auth-cookie', signupAnswer.token, { httpOnly: true });
      return signupAnswer.data;
    }
    return signupAnswer.error;
  }
}
