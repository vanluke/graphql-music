export const ROUTES = {
  root: '/',
  songs: '/songs',
  song: '/songs/:id',
  songEdit: '/songs/:id/edit',
  songAdd: '/songs/add',
  login: '/users/login',
  users: '/users',
};

export const GRAPHQL_SONGS_ENDPOINT = `${process.env.REACT_APP_BACKEND_ROOT_ENDPOINT}/songs`;
