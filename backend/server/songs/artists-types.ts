import * as graphql from 'graphql';

const { GraphQLObjectType, GraphQLString, GraphQLInt } = graphql;

const ArtistType = new GraphQLObjectType({
  name: 'Artist',
  fields: {
    id: { type: GraphQLInt },
    surname: { type: GraphQLString },
    first_name: { type: GraphQLString },
    nickname: { type: GraphQLString },
  },
});

export default ArtistType;
