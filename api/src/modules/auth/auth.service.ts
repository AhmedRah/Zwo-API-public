import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  buildAPIResponse,
  buildErrorResponse,
  ExposableError,
} from 'src/utils/general';
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
      console.log(error);
      return buildErrorResponse('Login Failed', error.errors);
    }
  }

  public async signup(user) {
    try {
      const pass = await this.hashPassword(user.password);

      console.log('here');
      const newUser = await this.userService.create({
        ...user,
        password: pass,
      });
      console.log('her2');

      // tslint:disable-next-line: no-string-literal
      const { password, ...result } = newUser['dataValues'];

      // generate token
      const token = await this.generateToken(result);

      // return the user and the token
      return buildAPIResponse('Login success', { user: result, token });
    } catch (error) {
      console.log(error);
      return buildErrorResponse('Signup Failed', error.errors);
    }
  }

  private async comparePassword(inputPass: string, dbPass: string) {
    const match = await bcrypt.compare(inputPass, dbPass);
    return match;
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }
}
