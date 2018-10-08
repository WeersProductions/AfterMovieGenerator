import * as React from 'react';
import styled from 'react-emotion';
import MusicPlayer from '../../MusicPlayer/MusicPlayer';

const DetailedAudio = (props) => {
  const { file } = props;
  return (
    <div>
      <MusicPlayer track={file} />
    </div>
  );
};

export default DetailedAudio;
