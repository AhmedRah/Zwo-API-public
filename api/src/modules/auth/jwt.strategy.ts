import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        // extending Passport config
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // for session management
            secretOrKey: process.env.JWTKEY
        });
    }

    async validate(payload: any) {
        // verify that the user in token data exist
        const user = await this.userService.findOneById(payload.id);
        if(!user) {
            throw new UnauthorizedException("Access denied")
        }
        return payload;
    }
}