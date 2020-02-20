import * as knex from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  db: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
};

const db = knex({
  client: 'postgres',
  connection: {
    database: config.db.database,
    host: config.db.host,
    user: config.db.user,
    port: 5001,
    password: config.db.password,
  },
  debug: true,
  pool: {
    min: 2,
    max: 6,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
  },
});

export default db;
