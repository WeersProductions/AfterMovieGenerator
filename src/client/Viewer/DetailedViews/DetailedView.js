import * as React from 'react';
import styled from 'react-emotion';
import DetailedAudio from './DetailedAudio';
import DetailedImage from './DetailedImage';

const Container = styled('div')`
  max-width: 100%;
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

const DetailedView = (props) => {
  const { file } = props;

  let fileComponent;
  if (file.type.includes('image')) {
    fileComponent = <DetailedImage file={file} />;
  }
  if (file.type.includes('audio')) {
    fileComponent = <DetailedAudio file={file} />;
  }

  return (
    <Container>
      {fileComponent}
      <Title>{file.name}</Title>
    </Container>
  );
};

export default DetailedView;
