import * as bcrypt from 'bcrypt';

const salt = '$2b$10$W5.OqKte4kHqx7Q2mbOINO';

export const encode = (value: string) => {
  return bcrypt.hashSync(value, salt);
};

export const compare = (value: string, hash: string) => {
  return bcrypt.compareSync(value, hash);
};
