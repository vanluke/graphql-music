import * as graphql from 'graphql';
import ArtistType from './artists-types';
import ThumbnailsType from './thumbnails-types';

const { GraphQLObjectType, GraphQLString, GraphQLInt } = graphql;

const SongType = new GraphQLObjectType({
  name: 'Song',
  fields: {
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    video_url: { type: GraphQLString },
    artist: {
      type: ArtistType,
    },
    thumbnails: {
      type: ThumbnailsType,
    },
  },
});

export default SongType;
