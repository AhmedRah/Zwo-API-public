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
      ignoreExpiration: false, // for session management
      secretOrKey: process.env.JWTKEY,
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'auth-cookie' in req.cookies &&
      req.cookies['auth-cookie'].length > 0
    ) {
      return req.cookies['auth-cookie'];
    }
    return null;
  }

  async validate(payload: any) {
    // verify that the user in token data exist
    const user = await this.userService.findOneById(payload.id);
    console.log(user);

    if (!user) {
      throw new UnauthorizedException('Access denied');
    }
    return payload;
  }
}
