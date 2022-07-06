import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { responseSuccess } from 'src/utils/response-parser';
import { GenerateSourceTokenDto, RegisterDto } from './auth.dto';
import jwt from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user: UserDocument = await this.userService.findOne<UserDocument>({
      email: username,
    });

    if (!user) {
      return null;
    }
    const isVerified = await verify(user.password, pass);

    if (!isVerified) {
      return null;
    }
    if (!user.isActive) {
      return null;
    }
    return user;
  }

  async login(user: UserDocument) {
    const payload = { uid: user._id };

    return responseSuccess('Login success', {
      token: this.jwtService.sign(payload),
    });
  }

  async register(data: RegisterDto) {
    await this.userService.shouldUnique(data, ['email']);
    await this.userService.create(data);
  }

  async generateSourceToken(dto: GenerateSourceTokenDto) {
    const { clientId, clientSecret } = dto;
    const token = await jwt.sign({ uid: clientId }, clientSecret, { expiresIn: '10m' });
    return token;
  }
}
