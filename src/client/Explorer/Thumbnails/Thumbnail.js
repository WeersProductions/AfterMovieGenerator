import * as React from 'react';
import styled from 'react-emotion';
import ThumbnailImage from './ThumbnailImage';
import ThumbnailAudio from './ThumbnailAudio';

const Container = styled('div')`
  width: 250px;
  height: auto;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  vertical-align: middle;
`;

const Title = styled('div')`
  width: 90%;
  margin: 5px auto;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
`;

const Thumbnail = (props) => {
  const { file } = props;

  let fileComponent;
  if (file.type.includes('image')) {
    fileComponent = <ThumbnailImage file={file} />;
  }
  if (file.type.includes('audio')) {
    fileComponent = <ThumbnailAudio file={file} />;
  }

  return (
    <Container>
      {fileComponent}
      <Title>{file.name}</Title>
    </Container>
  );
};

export default Thumbnail;
