import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const clientID = process.env.GOOGLE_CLIENT_ID || 'google-client-id-not-set';
    const clientSecret =
      process.env.GOOGLE_CLIENT_SECRET || 'google-client-secret-not-set';
    const callbackURL =
      process.env.GOOGLE_CALLBACK_URL ||
      'http://localhost:3001/api/auth/google/callback';

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      return done(new UnauthorizedException('Google account has no email'));
    }

    done(null, {
      email,
      googleId: profile.id,
      name: profile.displayName || `${profile.name?.givenName ?? ''}`.trim(),
      avatar: profile.photos?.[0]?.value,
    });
  }
}