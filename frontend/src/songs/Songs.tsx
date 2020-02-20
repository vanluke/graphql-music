import React, { FunctionComponent } from 'react';
import YoutubePlayer from '../components/youtube-player';
import { ROUTES } from '../constants';
import { Link } from 'react-router-dom';

export type Song = {
  id: number;
  title: string;
  video_url: string;
  thumbnails: Thumbnails;
  artist: Artist;
};

export type Thumbnails = {
  id: number;
  desktop_url: string;
  tablet_url: string;
  mobile_url: string;
};

export type Artist = {
  first_name: string;
  surname: string;
  nickname: string;
  id: number;
};

type SongsProps = {
  songs: Song[];
};

const Songs: FunctionComponent<SongsProps> = ({ songs }) => (
  <section>
    <h3>Songs</h3>
    <Link to={ROUTES.songAdd}>Create song</Link>
    {songs.map(song => (
      <div key={song.id}>
        <Link to={`${ROUTES.songs}/${song.id}`}>
          <h3>{song.title}</h3>
        </Link>

        <YoutubePlayer
          onEnd={handleEnd}
          onPause={handlePause}
          onPlay={handlePlay}
          onPlaybackRateChange={handlePlaybackRateChange}
          onPlayerError={handlePlayerError}
          onPlayerStateChange={handlePlayerStateChange}
          onReady={handleOnReady}
          size={size}
          videoUrl={stripVideoId(song.video_url)}
          title={song.title}
        />
      </div>
    ))}
  </section>
);

const size = {
  width: 320,
  height: 640,
};

export default Songs;

const handleEnd = () => console.log('end');

const handlePause = () => console.log('paused');

const handlePlay = () => console.log('play');

const handlePlaybackRateChange = () => console.log('rate changed');

const handlePlayerError = () => console.log('error');

const handlePlayerStateChange = () => console.log('state changed');

const handleOnReady = () => console.log('on ready');

const stripVideoId = (value: string) =>
  value.substring(value.lastIndexOf('/') + 1);
