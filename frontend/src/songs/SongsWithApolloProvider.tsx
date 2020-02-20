import React from 'react';
import Songs, {
  Song as SongType,
  Artist as ArtistType,
  Thumbnails as ThumbnailsType,
} from './Songs';
import { ApolloProvider, useQuery, useMutation } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { GRAPHQL_SONGS_ENDPOINT, ROUTES } from '../constants';
import { FETCH_SONGS, FETCH_SONG } from './query';
import {
  Route,
  Switch,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import Song from './Song';
import SongEdit from './SongEdit';
import { UPDATE_SONG, DELETE_SONG, CREATE_SONG } from './mutation';
import SongCreation from './SongCreation';
import { authService } from '../common/services';

const songsClient = new ApolloClient({
  uri: GRAPHQL_SONGS_ENDPOINT,
  request: operation => {
    const token = authService.getToken();
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

const SongsWithQuery = () => {
  const { loading, error, data } = useQuery<{ songs: SongType[] }>(
    FETCH_SONGS
  );
  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>error!</div>;
  }

  return <Songs songs={data!.songs} />;
};

const SongWithQuery: React.FunctionComponent<RouteComponentProps<{
  id: string;
}>> = ({ match }) => {
  const { loading, error, data } = useQuery<{ song: SongType }>(FETCH_SONG, {
    variables: {
      input: {
        id: parseInt(match.params.id, 10),
      },
    },
  });

  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>error!</div>;
  }
  return <Song song={data!.song} />;
};

const SongWithMutation: React.FunctionComponent<RouteComponentProps<{
  id: string;
}>> = ({ match, history }) => {
  const { loading, error, data } = useQuery<{
    song: SongType;
    artists: ArtistType[];
    thumbnails: ThumbnailsType[];
  }>(FETCH_SONG, {
    variables: {
      input: {
        id: parseInt(match.params.id, 10),
      },
    },
  });
  const [updateSong] = useMutation(UPDATE_SONG);
  const [deleteSong] = useMutation(DELETE_SONG);
  const [internalError, setInternalError] = React.useState<boolean>(false);

  const handleEdit = (values: {
    title: string;
    video_url: string;
    artist: ArtistType;
    thumbnails: ThumbnailsType;
  }): Promise<void> => {
    return new Promise((res, rej) => {
      updateSong({
        variables: {
          input: {
            thumbnails: values.thumbnails,
            artist: values.artist,
            videoUrl: values.video_url,
            title: values.title,
            id: data?.song.id,
          },
        },
      })
        .then(() => {
          res();
          return history.push(ROUTES.songs);
        })
        .catch(() => {
          setInternalError(true);
          return rej();
        });
    });
  };

  const handleDelete = () => {
    deleteSong({
      variables: {
        input: {
          id: data?.song.id,
        },
      },
    })
      .then(() => {
        return history.push(ROUTES.songs);
      })
      .catch(() => {
        setInternalError(true);
      });
  };

  if (loading) {
    return <div>loading...</div>;
  }
  if (error || internalError) {
    return <div>error!</div>;
  }
  return (
    <SongEdit
      song={data!.song}
      artists={data!.artists}
      thumbnails={data!.thumbnails}
      onEditSave={handleEdit}
      onDelete={handleDelete}
    />
  );
};

const SongCreationWithMutation: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const [createSong, r] = useMutation(CREATE_SONG);
  const [internalError, setInternalError] = React.useState<boolean>(false);
  const handleCreateSong = (values: {
    title: string;
    video_url: string;
  }): Promise<void> => {
    return createSong({
      variables: {
        input: {
          videoUrl: values.video_url,
          title: values.title,
          artistId: 6,
          thumbnailsId: 16,
        },
      },
    })
      .catch(() => {
        setInternalError(true);
      })
      .then(() => {
        return history.push(ROUTES.songs);
      });
  };

  if (r.loading) {
    return <div>loading...</div>;
  }
  if (r.error || internalError) {
    return <div>error!</div>;
  }
  return <SongCreation onCreateSong={handleCreateSong} />;
};

const SongsWithApolloProvider: React.FunctionComponent<RouteComponentProps> = () => (
  <ApolloProvider client={songsClient}>
    <Switch>
      <Route
        exact
        path={ROUTES.songAdd}
        component={SongCreationWithMutation}
      />
      <Route exact path={ROUTES.songs} component={SongsWithQuery} />
      <Route exact path={ROUTES.song} component={SongWithQuery} />
      <Route exact path={ROUTES.songEdit} component={SongWithMutation} />
    </Switch>
  </ApolloProvider>
);

export default withRouter(SongsWithApolloProvider);
