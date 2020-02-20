import React from 'react';
import YTPlayer from 'youtube-player';
import { YouTubePlayer } from 'youtube-player/dist/types';

type YoutubePlayerProps = {
  videoUrl: string;
  title: string;
  size: { width: number; height: number };

  onPlaybackRateChange: (event: CustomEvent & { data: number }) => void;
  onReady: (event: CustomEvent & { data: number }) => void;
  onPlayerError: (event: CustomEvent & { data: number }) => void;
  onPlayerStateChange: (event: CustomEvent & { data: number }) => void;
  onEnd: (event: CustomEvent & { data: number }) => void;
  onPlay: (event: CustomEvent & { data: number }) => void;
  onPause: (event: CustomEvent & { data: number }) => void;
};

class YoutubePlayer extends React.Component<YoutubePlayerProps> {
  playerRef = React.createRef<HTMLDivElement>();
  player: YouTubePlayer | null = null;

  componentDidMount() {
    this.createYouTubePlayer();
  }

  componentDidUpdate(preProps: YoutubePlayerProps) {
    if (
      this.isYouTubePlayerDefined() &&
      this.shouldUpdatePlayer(preProps.videoUrl)
    ) {
      this.updateVideoUrl();
    }
  }

  componentWillUnmount() {
    if (this.isYouTubePlayerDefined()) {
      this.player!.destroy();
    }
  }

  createYouTubePlayer = () => {
    if (this.playerRef && this.playerRef.current) {
      const { videoUrl, size } = this.props;
      this.player = YTPlayer(this.playerRef.current!, {
        videoId: videoUrl,
        height: size.height,
        width: size.width,
      });

      this.player.on('ready' as 'stateChange', this.props.onReady);
      this.player!.on('error' as 'stateChange', this.props.onPlayerError);
      this.player!.on('stateChange', this.onPlayerStateChange);
      this.player.on(
        'playbackRateChange' as 'stateChange',
        this.props.onPlaybackRateChange
      );
      this.player.on(
        'playbackQualityChange' as 'stateChange',
        this.props.onPlaybackRateChange
      );
    }
  };

  updateVideoUrl = () => {
    if (this.isYouTubePlayerDefined()) {
      this.player!.loadVideoById(this.props.videoUrl);
    }
  };

  onPlayerStateChange = (event: CustomEvent & { data: number }) => {
    switch (event.data) {
      case PLAYER_STATE.ended:
        this.props.onEnd(event);
        break;

      case PLAYER_STATE.playing:
        this.props.onPlay(event);
        break;

      case PLAYER_STATE.paused:
        this.props.onPause(event);
        break;

      default:
    }
  };

  shouldUpdatePlayer = (prevVideoUrl: string) => {
    return this.props.videoUrl !== prevVideoUrl;
  };

  isYouTubePlayerDefined = () => {
    return this.player !== null;
  };

  render() {
    const { title } = this.props;
    return <div ref={this.playerRef} title={title} />;
  }
}

export default YoutubePlayer;

const PLAYER_STATE = {
  unstarted: -1,
  ended: 0,
  playing: 1,
  paused: 2,
  buffering: 3,
  videoCued: 5,
};
