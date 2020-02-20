import React, { FunctionComponent } from 'react';
import YoutubePlayer from '../components/youtube-player';
import { ROUTES } from '../constants';
import { Link } from 'react-router-dom';
import { Song as SongType } from './Songs';

type SongProps = {
  song: SongType;
};

const Song: FunctionComponent<SongProps> = ({ song }) => (
  <section>
    <h3>Song {song.title}</h3>
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
    <Link to={ROUTES.songs}>Go back</Link>
  </section>
);

const size = {
  width: ('100%' as unknown) as number,
  height: ('100%' as unknown) as number,
};

export default Song;

const handleEnd = () => console.log('end');

const handlePause = () => console.log('paused');

const handlePlay = () => console.log('play');

const handlePlaybackRateChange = () => console.log('rate changed');

const handlePlayerError = () => console.log('error');

const handlePlayerStateChange = () => console.log('state changed');

const handleOnReady = () => console.log('on ready');

const stripVideoId = (value: string) =>
  value.substring(value.lastIndexOf('/') + 1);
