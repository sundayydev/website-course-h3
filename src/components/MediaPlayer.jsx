import React from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

const MediaPlayer = ({ type = 'video', url, poster, title }) => {
  const source = {
    type,
    title,
    poster: type === 'video' ? poster : undefined,
    sources: [
      {
        src: url,
        type: type === 'video' ? 'video/mp4' : 'audio/mp3',
      },
    ],
  };

  const commonOptions = {
    autoplay: false,
    muted: false,
    clickToPlay: true,
    keyboard: { focused: true, global: true },
    tooltips: { controls: true, seek: true },
  };

  const videoOptions = {
    ...commonOptions,
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'captions',
      'settings',
      'pip',
      'airplay',
      'fullscreen',
    ],
    settings: ['captions', 'quality', 'speed'],
    quality: {
      default: 720,
      options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
    },
    fullscreen: { enabled: true, iosNative: true },
  };

  const audioOptions = {
    ...commonOptions,
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings'],
    settings: ['speed'],
  };

  return (
    <div className="w-full aspect-video rounded-lg shadow-lg overflow-hidden">
      <Plyr source={source} options={type === 'video' ? videoOptions : audioOptions} />
    </div>
  );
};

export default MediaPlayer;
