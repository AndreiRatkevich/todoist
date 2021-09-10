import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(user: any) {
    const tokenInfo = await this.oauthClient.getTokenInfo(user.accessToken);

    const email = tokenInfo.email;

    try {
      const user = await this.usersService.getByEmail(email);

      return this.handleRegisteredUser(user);
    } catch (error) {
      if (error.status !== 404) {
        throw new error();
      }

      return this.registerUser(user.accessToken, email);
    }
  }

  async registerUser(token: string, email: string) {
    const userData = await this.getUserData(token);
    const name = userData.name;

    const user = await this.usersService.createWithGoogle(email, name);

    return this.handleRegisteredUser(user);
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  async getCookiesForUser(user: User) {
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);

    return cookie;
  }

  async handleRegisteredUser(user: User) {
    if (!user.isRegisteredWithGoogle) {
      throw new UnauthorizedException();
    }

    const cookie = await this.getCookiesForUser(user);

    return {
      cookie,
      user,
    };
  }
}
