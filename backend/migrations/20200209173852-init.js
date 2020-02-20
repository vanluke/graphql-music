'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable(
    'users',
    {
      columns: {
        id: {
          type: 'int',
          primaryKey: true,
          autoIncrement: true,
          notNull: true,
        },
        name: 'string',
        email: 'string',
        avatar: 'string',
        createdAt: 'date',
      },
      ifNotExists: true,
    },
    callback
  );

  db.createTable(
    'users_password',
    {
      columns: {
        id: {
          type: 'int',
          primaryKey: true,
          autoIncrement: true,
          notNull: true,
        },
        user_id: {
          type: 'int',
          notNull: true,
          foreignKey: {
            name: 'users_password_users_id_fk',
            table: 'users',
            rules: {
              onDelete: 'CASCADE',
              onUpdate: 'RESTRICT',
            },
            mapping: {
              user_id: 'id',
            },
          },
        },
        password: {
          type: 'string',
          notNull: true,
        },
      },
      ifNotExists: true,
    },
    callback
  );

  db.createTable('artists', {
    columns: {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
      },
      first_name: {
        type: 'string',
        notNull: true,
      },
      surname: {
        type: 'string',
        notNull: true,
      },
      nickname: {
        type: 'string',
      },
    },
    callback,
  });

  db.createTable('thumbnails', {
    columns: {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
      },
      mobile_url: {
        type: 'string',
        notNull: true,
      },
      desktop_url: {
        type: 'string',
        notNull: true,
      },
      tablet_url: {
        type: 'string',
        notNull: true,
      },
    },
    callback,
  });

  db.createTable('songs', {
    columns: {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
      },
      title: {
        type: 'string',
        notNull: true,
      },
      artist_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'artists_songs_id_fk',
          table: 'artists',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: {
            artist_id: 'id',
          },
        },
      },
      video_url: {
        type: 'string',
      },
      thumbnails_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'thumbnails_songs_id_fk',
          table: 'thumbnails',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: {
            thumbnails_id: 'id',
          },
        },
      },
    },
    callback,
  });
};

exports.down = function(db, callback) {
  db.removeForeignKey(
    'users_password',
    'users_password_users_id_fk',
    {
      dropIndex: true,
    },
    callback
  );

  db.removeForeignKey(
    'songs',
    'artists_songs_id_fk',
    {
      dropIndex: true,
    },
    callback
  );

  db.removeForeignKey(
    'songs',
    'thumbnails_songs_id_fk',
    {
      dropIndex: true,
    },
    callback
  );

  db.dropTable('users', callback);

  db.dropTable('users_password', callback);

  db.dropTable('artists', callback);

  db.dropTable('thumbnails', callback);

  db.dropTable('songs', callback);
};

exports._meta = {
  version: 1,
};
