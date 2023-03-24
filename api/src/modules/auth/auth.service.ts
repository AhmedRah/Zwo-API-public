import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PASSWORD_REGEX } from '../../core/constants';
import { ValidationException } from '../../utils/error';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      return null;
    }

    const correctPass = await this.comparePassword(pass, user.password);
    if (!correctPass) {
      return null;
    }

    return user['dataValues'];
  }

  public async login(user) {
    return await this.generateToken(user);
  }

  public async signup(user) {
    if (!PASSWORD_REGEX.test(user.password)) {
      throw new BadRequestException('Password invalid');
    }

    const newUser = await this.userService
      .create({
        ...user,
        password: await this.hashPassword(user.password),
      })
      .catch((e) => ValidationException(e));

    return await this.generateToken(newUser['dataValues']);
  }

  private async comparePassword(inputPass: string, dbPass: string) {
    return await bcrypt.compare(inputPass, dbPass);
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
  }

  private async generateToken(user) {
    return await this.jwtService.signAsync({
      id: user.id,
      username: user.username,
    });
  }
}
