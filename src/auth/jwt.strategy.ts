import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        const cookieToken = req.cookies?.auth_token;

        const authHeader = req.headers?.authorization;
        const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        const token = cookieToken || headerToken;

        if (!token) {
          throw new UnauthorizedException('Token not found in cookies or Authorization header');
        }

        return token;
      },
      ignoreExpiration: false,
      secretOrKey: 'secretkey',
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, phoneNumber: payload.phoneNumber };
  }
}
