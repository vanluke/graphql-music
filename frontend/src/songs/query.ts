import { gql } from 'apollo-boost';

const FETCH_SONGS = gql`
  {
    songs {
      id
      title
      video_url
    }
  }
`;

const FETCH_SONG = gql`
  query GetSong($input: GetSongInput!) {
    song(input: $input) {
      id
      title
      video_url
      artist {
        id
        surname
        first_name
        nickname
      }
      thumbnails {
        id
        desktop_url
        mobile_url
        tablet_url
      }
    }
    artists {
      id
      surname
      first_name
      nickname
    }
    thumbnails {
      id
      desktop_url
      mobile_url
      tablet_url
    }
  }
`;

export { FETCH_SONGS, FETCH_SONG };
