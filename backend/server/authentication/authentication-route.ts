import * as express from 'express';
import db from '../common/knex';
import { encode, compare } from '../common/crypto';
import * as jwt from 'jsonwebtoken';
import { AUTHENTICATION } from '../constants';
import { removeWhiteSpaces } from '../common/utils';

export default function configure(app: express.Application) {
  app.post('/login', function(req: express.Request, res: express.Response) {
    const email = removeWhiteSpaces(req.body.email);
    const password = removeWhiteSpaces(req.body.password);
    if (!email || !password) {
      return res.status(401).end();
    }
    db.select(
      'u.id as id',
      'u.name as name',
      'u.email as email',
      'p.user_id as user_id',
      'p.password as password'
    )
      .from('users AS u')
      .join('users_password as p', 'u.id', 'p.user_id')
      .where('u.email', email)
      .then((userResults: any[]) => {
        const user = userResults.find(item => item.email === email);

        const hashPassword = encode(password);

        const isPasswordEqual = user.password === hashPassword;
        if (isPasswordEqual) {
          const token = jwt.sign({ id: user.id }, AUTHENTICATION.secret);
          return res.status(200).send({ token });
        }
        return res.status(401).end();
      });
  });
}
