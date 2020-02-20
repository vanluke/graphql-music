import gql from 'graphql-tag';

export const CREATE_SONG = gql`
  mutation CreateSong($input: CreateSongInput!) {
    addSong(input: $input) {
      video_url
      title
    }
  }
`;

export const UPDATE_SONG = gql`
  mutation UpdateSong($input: UpdateSongInput!) {
    updateSong(input: $input) {
      video_url
      title
    }
  }
`;

export const DELETE_SONG = gql`
  mutation DeleteSong($input: DeleteSongInput!) {
    deleteSong(input: $input) {
      id
    }
  }
`;
