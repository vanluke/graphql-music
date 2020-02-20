const bcrypt = require('bcrypt');

const salt = '$2b$10$W5.OqKte4kHqx7Q2mbOINO';

module.exports = function seed(db) {
  db.insert(
    'users',
    ['name', 'email', 'avatar', 'createdAt'],
    [
      'Luke Black',
      'luke@black.com',
      'https://media.giphy.com/media/12s75Gk1yn9Ml2/giphy.gif',
      new Date().toDateString(),
    ]
  ).then(usr => {
    console.log('user', usr);
    db.insert(
      'users_password',
      ['user_id', 'password'],
      [usr.id, bcrypt.hashSync('password', salt)]
    );
  });

  artists.map(function(artist) {
    return db.insert(
      'artists',
      ['first_name', 'surname', 'nickname'],
      [artist.first_name, artist.surename, artist.nickname]
    );
  });

  thumbnails.map(function(thumbnail) {
    return db.insert(
      'thumbnails',
      ['mobile_url', 'desktop_url', 'tablet_url'],
      [thumbnail.mobile_url, thumbnail.desktop_url, thumbnail.tablet_url]
    );
  });

  const selectThumbnailsIds = db.runSql('select id from thumbnails');
  const selectArtistsIds = db.runSql('select id from artists');
  Promise.all([selectThumbnailsIds, selectArtistsIds])
    .then(ids => {
      console.log('ids', ids);
      const thumbnailsIds = ids[0]; //.map(item => item.id);
      const artistsIds = ids[1]; //.map(item => item.id);

      songs.map(function(song) {
        return db.insert(
          'songs',
          ['title', 'artist_id', 'video_url', 'thumbnails_id'],
          [
            song.title,
            artistsIds[randomIndex(0, artistsIds.length)],
            song.video_url,
            thumbnailsIds[randomIndex(0, thumbnailsIds.length)],
          ]
        );
      });
    })
    .catch(err =>
      console.log('Error while selecting thumbnails or artists', err)
    );
};

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
    surename: 'Mckinney',
    nickname: 'duis',
  },
  {
    first_name: 'Lavonne ',
    surename: 'Alvarez',
    nickname: 'velit',
  },
  {
    first_name: 'Dale ',
    surename: 'Macias',
    nickname: 'commodo',
  },
  {
    first_name: 'Irene ',
    surename: 'Stokes',
    nickname: 'ipsum',
  },
  {
    first_name: 'Howell ',
    surename: 'Reese',
    nickname: 'laboris',
  },
  {
    first_name: 'Tiffany ',
    surename: 'Jennings',
    nickname: 'ad',
  },
  {
    first_name: 'Ronda ',
    surename: 'Hughes',
    nickname: 'cillum',
  },
  {
    first_name: 'Reid ',
    surename: 'Chase',
    nickname: 'ad',
  },
  {
    first_name: 'Simone ',
    surename: 'Prince',
    nickname: 'pariatur',
  },
  {
    first_name: 'Lorrie ',
    surename: 'Ross',
    nickname: 'esse',
  },
  {
    first_name: 'Neal ',
    surename: 'Snyder',
    nickname: 'ut',
  },
  {
    first_name: 'Allyson ',
    surename: 'Hampton',
    nickname: 'sint',
  },
  {
    first_name: 'Iris ',
    surename: 'William',
    nickname: 'aliqua',
  },
  {
    first_name: 'Deleon ',
    surename: 'Moses',
    nickname: 'cupidatat',
  },
  {
    first_name: 'Lois ',
    surename: 'Montoya',
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
