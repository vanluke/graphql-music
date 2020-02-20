import * as graphql from 'graphql';

const { GraphQLObjectType, GraphQLString, GraphQLInt } = graphql;

const ThumbnailsType = new GraphQLObjectType({
  name: 'Thumbnails',
  fields: {
    id: { type: GraphQLInt },
    mobile_url: { type: GraphQLString },
    desktop_url: { type: GraphQLString },
    tablet_url: { type: GraphQLString },
  },
});

export default ThumbnailsType;
