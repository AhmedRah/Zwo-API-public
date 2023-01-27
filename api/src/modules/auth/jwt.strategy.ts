import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    // extending Passport config
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // for session management
      secretOrKey: process.env.JWTKEY,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let data = request?.cookies['auth-cookie'];
          if (!data) {
            return null;
          }
          return data.token;
        },
      ]),
    });
  }

  async validate(payload: any) {
    // verify that the user in token data exist
    const user = await this.userService.findOneById(payload.id);
    if (!user) {
      throw new UnauthorizedException('Access denied');
    }
    return payload;
  }
}
