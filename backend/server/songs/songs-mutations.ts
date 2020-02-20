import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql';
import SongType from './songs-types';
import db from '../common/knex';
import { removeUndefinedFields } from '../common/utils';

const addSongInput = new GraphQLInputObjectType({
  name: 'CreateSongInput',
  description: 'Input payload for add song',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    artistId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    thumbnailsId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    videoUrl: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

const deleteSongInput = new GraphQLInputObjectType({
  name: 'DeleteSongInput',
  description: 'Input payload for delete song',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});

const updateArtistInput = new GraphQLInputObjectType({
  name: 'UpdateArtistInput',
  description: 'Input payload for update song',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    nickname: {
      type: new GraphQLNonNull(GraphQLString),
    },
    surname: {
      type: new GraphQLNonNull(GraphQLString),
    },
    first_name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

const updateThumbnailsInput = new GraphQLInputObjectType({
  name: 'UpdateThumbnailsInput',
  description: 'Input payload for update song',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    desktop_url: {
      type: new GraphQLNonNull(GraphQLString),
    },
    mobile_url: {
      type: new GraphQLNonNull(GraphQLString),
    },
    tablet_url: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

const updateSongInput = new GraphQLInputObjectType({
  name: 'UpdateSongInput',
  description: 'Input payload for update song',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    title: {
      type: GraphQLString,
    },
    videoUrl: {
      type: GraphQLString,
    },
    artist: { type: updateArtistInput },
    thumbnails: { type: updateThumbnailsInput },
  }),
});

const mutations = new GraphQLObjectType({
  name: 'SongsMutations',
  fields: {
    updateSong: {
      type: SongType,
      args: {
        input: {
          type: new GraphQLNonNull(updateSongInput),
        },
      },
      resolve(_, { input }, context) {
        if (!context.user.isAuthenticated()) {
          return context.res.status(401).end();
        }
        if (
          Object.keys(input).length === 0 ||
          typeof input.id === 'undefined'
        ) {
          throw new Error('Input payload is empty.');
        }
        const updatedSong = removeUndefinedFields({
          title: input.title,
          video_url: input.videoUrl,
          artist_id: input.artist.id,
          thumbnails_id: input.thumbnails.id,
        });

        return db('songs')
          .where('id', input.id)
          .update(updatedSong)
          .returning('*')
          .into('songs')
          .then((res: any) =>
            res.find((item: { id: number }) => item.id === input.id)
          )
          .catch((err: Error) => err);
      },
    },
    deleteSong: {
      type: SongType,
      args: {
        input: {
          type: new GraphQLNonNull(deleteSongInput),
        },
      },
      resolve(_, args, context) {
        if (!context.user.isAuthenticated()) {
          return context.res.status(401).end();
        }
        const { input } = args;
        return db('songs')
          .where('id', input.id)
          .del()
          .then((res: any) => res)
          .catch((err: Error) => err);
      },
    },
    addSong: {
      type: SongType,
      args: {
        input: {
          type: new GraphQLNonNull(addSongInput),
        },
      },
      resolve(_, args, context) {
        if (!context.user.isAuthenticated()) {
          return context.res.status(401).end();
        }
        const { input } = args;
        return db('songs')
          .insert({
            title: input.title,
            artist_id: input.artistId,
            thumbnails_id: input.thumbnailsId,
            video_url: input.videoUrl,
          })
          .returning('*')
          .into('songs')
          .then((res: any) => {
            return res.find(
              (item: { title: string }) => item.title === input.title
            );
          })
          .catch((err: Error) => err);
      },
    },
  },
});

export { mutations };
