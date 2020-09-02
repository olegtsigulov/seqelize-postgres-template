import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: JwtPayloadDto): Promise<UserDto> {
    return this.userService.findOne({ where: { email: payload.email, id: payload.id } });
  }
}
