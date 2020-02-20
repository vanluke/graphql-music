import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import { AUTHENTICATION } from '../constants';
import db from '../common/knex';

export default function configure(app: express.Application) {
  app.use(async function(
    request: express.Request,
    _: express.Response,
    next: express.NextFunction
  ) {
    try {
      const authorization = request.headers.authorization;

      const token = getToken(authorization || '');
      const decoded = <{ id: number }>(
        jwt.verify(token || '', AUTHENTICATION.secret)
      );
      const user = (((await db('users').where(
        'id',
        decoded.id
      )) as unknown) as {
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        avatar?: string;
      }[]).find(item => item.id === decoded.id);
      const appUser = new AppUser(user);
      ((request as unknown) as { user: AppUser }).user = appUser;
    } catch (e) {
      const appUser = new AppUser();
      ((request as unknown) as { user: AppUser }).user = appUser;
    }
    return next();
  });
}

class AppUser {
  constructor(
    private claims?: {
      email: string;
      name: string;
      createdAt: Date;
      avatar?: string;
    }
  ) {}

  isAuthenticated() {
    return !!this.claims && !!this.claims.email;
  }
}

const getToken = (authorization: string) =>
  authorization.split('Bearer').find(item => !!item) &&
  authorization
    .split('Bearer')
    .find(e => !!e)!
    .replace(/\s/g, '');
