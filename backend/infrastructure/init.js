require('dotenv').config();

const bcrypt = require('bcrypt');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const config = {
  db: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
};

const db = require('knex')({
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
    createTimeoutMillis: 3000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
    propagateCreateError: false, // <- default is true, set to false
  },
});

console.log('Creating tables ...');

const FAKE_INIT_USER = {
  name: 'Lukasz Black',
  email: 'lukasz@black.com',
  avatar: 'https://media.giphy.com/media/12s75Gk1yn9Ml2/giphy.gif',
  createdAt: new Date(),
  password: bcrypt.hashSync('password', salt),
};

db.transaction(function(trx) {
  seed(trx);
});

function seed() {
  db('users')
    .select()
    .where('email', FAKE_INIT_USER.email)
    .then(data => {
      console.log('Adding users', data);
      if (data && data.length === 0) {
        db('users')
          .insert({
            email: FAKE_INIT_USER.email,
            name: FAKE_INIT_USER.name,
            createdAt: FAKE_INIT_USER.createdAt,
            avatar: FAKE_INIT_USER.avatar,
          })
          .returning('id')
          .into('users')
          .then(function(claims) {
            db('users_password')
              .insert({
                user_id: claims[0],
                password: FAKE_INIT_USER.password,
              })
              .then();
          })
          .then(() => {})
          .catch(err => console.log('Unable to add users', err));
      } else if (data && data.length > 0) {
        db('users_password')
          .where('user_id', data[0].id)
          .select()
          .then(userPassword => {
            if (userPassword && userPassword.length === 0) {
              db('users_password')
                .insert({
                  user_id: data[0].id,
                  password: FAKE_INIT_USER.password,
                })
                .then();
            }
          });
      }
    })
    .then(() => {
      console.log('seed finished...');
    });

  const artistsIds = db('artists')
    .insert(artists)
    .returning('id')
    .into('artists');
  const thumbnailsIds = db('thumbnails')
    .insert(thumbnails)
    .returning('id')
    .into('thumbnails');

  Promise.all([artistsIds, thumbnailsIds])
    .then(ids => {
      const thumbnailsIds = ids[1];
      const artistsIds = ids[0];
      const readySongs = songs.map(function(song) {
        return {
          title: song.title,
          artist_id: artistsIds[randomIndex(0, artistsIds.length)],
          video_url: song.video_url,
          thumbnails_id: thumbnailsIds[randomIndex(0, thumbnailsIds.length)],
        };
      });

      db('songs')
        .insert(readySongs)
        .then();
    })
    .catch(err => {
      console.log('Error while selecting thumbnails or artists', err);
      process.exit(1);
    })
    .then(() => {
      process.exit(0);
    });
}

function randomIndex(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const thumbnails = [
  {
    mobile_url:
      'https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=400 ',
    desktop_url:
      'https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
    tablet_url:
      'https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=900&q=80',
  },
  {
    mobile_url:
      'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=400&q=80 ',
    desktop_url:
      'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80 ',
    tablet_url:
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tourinews.es%2Fdestinos-turismo%2Fsorpresa-los-monumentos-mas-famosos-no-son-los-favoritos_4439682_102.html&psig=AOvVaw0qGadhe358oyccKhiq6I_f&ust=1581362456491000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCNjr5K-YxecCFQAAAAAdAAAAABAU',
  },
  {
    mobile_url:
      'https://images.unsplash.com/photo-1532910404247-7ee9488d7292?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=444&q=80',
    desktop_url:
      'https://images.unsplash.com/photo-1532910404247-7ee9488d7292?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1164&q=80',
    tablet_url:
      'https://images.unsplash.com/photo-1532910404247-7ee9488d7292?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=964&q=80',
  },
  {
    mobile_url:
      'https://images.unsplash.com/photo-1543229401-42ac8d431159?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
    desktop_url:
      'https://images.unsplash.com/photo-1543229401-42ac8d431159?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80',
    tablet_url:
      'https://images.unsplash.com/photo-1543229401-42ac8d431159?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80',
  },
];

const artists = [
  {
    first_name: 'Myers ',
    surname: 'Mckinney',
    nickname: 'duis',
  },
  {
    first_name: 'Lavonne ',
    surname: 'Alvarez',
    nickname: 'velit',
  },
  {
    first_name: 'Dale ',
    surname: 'Macias',
    nickname: 'commodo',
  },
  {
    first_name: 'Irene ',
    surname: 'Stokes',
    nickname: 'ipsum',
  },
  {
    first_name: 'Howell ',
    surname: 'Reese',
    nickname: 'laboris',
  },
  {
    first_name: 'Tiffany ',
    surname: 'Jennings',
    nickname: 'ad',
  },
  {
    first_name: 'Ronda ',
    surname: 'Hughes',
    nickname: 'cillum',
  },
  {
    first_name: 'Reid ',
    surname: 'Chase',
    nickname: 'ad',
  },
  {
    first_name: 'Simone ',
    surname: 'Prince',
    nickname: 'pariatur',
  },
  {
    first_name: 'Lorrie ',
    surname: 'Ross',
    nickname: 'esse',
  },
  {
    first_name: 'Neal ',
    surname: 'Snyder',
    nickname: 'ut',
  },
  {
    first_name: 'Allyson ',
    surname: 'Hampton',
    nickname: 'sint',
  },
  {
    first_name: 'Iris ',
    surname: 'William',
    nickname: 'aliqua',
  },
  {
    first_name: 'Deleon ',
    surname: 'Moses',
    nickname: 'cupidatat',
  },
  {
    first_name: 'Lois ',
    surname: 'Montoya',
    nickname: 'culpa',
  },
];

const songs = [
  {
    title: 'incididunt',
    video_url: 'https://youtu.be/0S7Qu5HMiCA',
  },
  {
    title: 'quis',
    video_url: 'https://youtu.be/7QU1nvuxaMA',
  },
  {
    title: 'sint',
    video_url: 'https://youtu.be/kXYiU_JCYtU',
  },
  {
    title: 'excepteur',
    video_url: 'https://youtu.be/kXYiU_JCYtU',
  },
  {
    title: 'consequat',
    video_url: 'https://youtu.be/gGdGFtwCNBE',
  },
];
