import * as React from 'react';
import styled from 'react-emotion';
import TrackInformation from '../../MusicPlayer/TrackInformation';

const Artwork = styled('div')`
  max-width: 300px;
  max-height: 300px;
  background-size: cover;
  background-position: center center;
  border-radius: 4px;
  margin: auto;
  box-shadow: 0 5px 10px -5px rgba(18, 18, 18, 0.25);
  position: relative;
  background-image: ${props => props.backgroundImage};
`;

const Background = styled('div')`
  width: 150%;
  height: 150%;
  position: absolute;
  top: -25%;
  left: -25%;
  background-size: cover;
  background-position: center center;
  opacity: 0.2;
  filter: blur(10px);
  background-image: '${props => props.backgroundImage}';
`;

const ThumbnailAudio = (props) => {
  const { file } = props;
  return (
    <div>
      <Artwork backgroundImage={`url(${file.picture})`} />
      <Background backgroundImage={`url(${file.picture})`} />
      <TrackInformation track={file} />
    </div>
  );
};

export default ThumbnailAudio;
