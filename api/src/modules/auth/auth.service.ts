import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { buildAPIResponse, buildErrorResponse, } from 'src/utils/general';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByUserame(username);
    if (!user) {
      return null;
    }

    const correctPass = await this.comparePassword(pass, user.password);
    if (!correctPass) {
      return null;
    }

    // tslint:disable-next-line: no-string-literal
    const { password, ...result } = user['dataValues'];
    return result;
  }

  public async login(user) {
    try {
      const token = await this.generateToken(user);
      return buildAPIResponse('Login success', { user, token });
    } catch (error) {
      return buildErrorResponse('Login Failed', error.errors);
    }
  }

  public async signup(user) {
    try {
      const pass = await this.hashPassword(user.password);

      const newUser = await this.userService.create({
        ...user,
        password: pass,
      });

      // tslint:disable-next-line: no-string-literal
      const { password, ...result } = newUser['dataValues'];

      // generate token
      const token = await this.generateToken(result);

      // return the user and the token
      return buildAPIResponse('Login success', { user: result, token });
    } catch (error) {
      return buildErrorResponse('Signup Failed', error.errors);
    }
  }

  private async comparePassword(inputPass: string, dbPass: string) {
    return await bcrypt.compare(inputPass, dbPass);
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  private async generateToken(user) {
    return await this.jwtService.signAsync(user);
  }
}
