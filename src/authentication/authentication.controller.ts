import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { RequestWithUser } from './requestWithUser.interface';
import { Response } from 'express';
import { GoogleAuthenticationService } from '../googleAuthentication/googleAuthentication.service';
import { TokenVerificationDto } from './dto/tokenVerification.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post('registration')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const { cookie, user } =
      await this.googleAuthenticationService.authenticate(req.user);

    req.res.setHeader('Set-Cookie', cookie);

    return user;
  }
}
