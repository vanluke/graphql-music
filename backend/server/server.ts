import * as express from 'express';
import * as parser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
import songsRoutes from './songs/songs-routes';
import authRoutes from './authentication/authentication-route';
import initializeAuthentication from './authentication/middleware';

dotenv.config();

const APP_PORT = parseInt(process.env.NODE_PORT || '3001', 10);

const APP_HOST = process.env.NODE_HOST || '127.0.0.1';

const app = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(cors());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

initializeAuthentication(app);
authRoutes(app);
songsRoutes(app);

app.listen(APP_PORT, APP_HOST, () =>
  console.log(`Listening on ${APP_HOST}:${APP_PORT}`)
);
