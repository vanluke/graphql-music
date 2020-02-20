import * as expressGQL from 'express-graphql';
import * as express from 'express';
import { GraphQLSchema } from 'graphql';
import { query } from './songs-queries';
import { mutations } from './songs-mutations';

const schema = new GraphQLSchema({
  query,
  mutation: mutations,
});

export default function(app: express.Application) {
  if (typeof app === 'undefined') {
    throw new Error('Express app is not defined.');
  }
  app.use('/songs', (req: express.Request, res: express.Response) => {
    return expressGQL({
      schema,
      graphiql: true,
      pretty: true,
      context: {
        req,
        res,
        user: ((req as unknown) as { user: { id: number } }).user,
      },
    })(req, res);
  });
}
