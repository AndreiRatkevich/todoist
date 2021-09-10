import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './tokenPayload.interface';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    if (isNaN(Number(req.params.projectId))) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    const allowedAccess = await this.projectsService.checkingAccess(
      payload.userId,
      +req.params.projectId,
    );
    if (!allowedAccess.length) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userService.getById(payload.userId);
    delete user.password;
    return user;
  }
}
