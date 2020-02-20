import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';
import SongType from './artists-types';
import db from '../common/knex';

const getSongInput = new GraphQLInputObjectType({
  name: 'GetArtistInput',
  description: 'Input payload for add song',
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    title: {
      type: GraphQLString,
    },
  }),
});

const query = new GraphQLObjectType({
  name: 'ArtistQuery',
  fields: {
    songs: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SongType))),
      resolve: () => {
        return db('songs')
          .select(
            's.id AS id',
            's.title AS title',
            's.video_url AS video_url',
            's.artist_id AS artist_id',
            's.thumbnails_id AS thumbnails_id',
            'c.surname AS surname',
            'c.first_name AS first_name',
            'c.nickname AS nickname',
            't.mobile_url AS mobile_url',
            't.desktop_url AS desktop_url',
            't.tablet_url AS tablet_url'
          )
          .from('songs AS s')
          .join('artists AS c', 's.artist_id', 'c.id')
          .join('thumbnails AS t', 's.thumbnails_id', 't.id')
          .then((res: any) => {
            const t = res.map(transformDBResponse);
            console.log('res', t);
            return t;
          })
          .catch((err: Error) => err);
      },
    },
    song: {
      type: new GraphQLNonNull(SongType),
      args: {
        input: {
          type: new GraphQLNonNull(getSongInput),
        },
      },
      resolve: (_, { input: { id, title } }) => {
        if (typeof id !== 'undefined') {
          return db
            .select(
              's.id AS id',
              's.title AS title',
              's.video_url AS video_url',
              's.artist_id AS artist_id',
              's.thumbnails_id AS thumbnails_id',
              'c.surname AS surname',
              'c.first_name AS first_name',
              'c.nickname AS nickname',
              't.mobile_url AS mobile_url',
              't.desktop_url AS desktop_url',
              't.tablet_url AS tablet_url'
            )
            .from('songs AS s')
            .join('artists AS c', 's.artist_id', 'c.id')
            .join('thumbnails AS t', 's.thumbnails_id', 't.id')
            .where('s.id', id)
            .then((res: any[]) => {
              return transformDBResponse(res.find(item => item.id === id));
            })
            .catch((err: Error) => err);
        }

        return db
          .select(
            's.id AS id',
            's.title AS title',
            's.video_url AS video_url',
            's.artist_id AS artist_id',
            's.thumbnails_id AS thumbnails_id',
            'c.surname AS surname',
            'c.first_name AS first_name',
            'c.nickname AS nickname',
            't.mobile_url AS mobile_url',
            't.desktop_url AS desktop_url',
            't.tablet_url AS tablet_url'
          )
          .from('songs AS s')
          .join('artists AS c', 's.artist_id', 'c.id')
          .join('thumbnails AS t', 's.thumbnails_id', 't.id')
          .where('s.title', title)
          .then((res: any[]) =>
            transformDBResponse(res.find(item => item.title === title))
          )
          .catch((err: Error) => err);
      },
    },
  },
});

export { query };

type DBSong = {} & any;

type Song = {} & any;

const transformDBResponse = (song: DBSong): Song => {
  const {
    artist_id,
    thumbnails_id,
    surname,
    first_name,
    nickname,
    mobile_url,
    desktop_url,
    tablet_url,
    ...rest
  } = song;
  return {
    ...rest,
    artist: {
      artist_id,
      surname,
      first_name,
      nickname,
    },
    thumbnails: {
      thumbnails_id,
      mobile_url,
      desktop_url,
      tablet_url,
    },
  };
};
