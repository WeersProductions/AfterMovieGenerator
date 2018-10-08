import * as React from 'react';
import styled from 'react-emotion';

const Container = styled('img')`
  max-width: 250px;
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

const ThumbnailImage = (props) => {
  const { file } = props;
  return (
    <div>
      <Container src={file.url} alt={file.name} />
      <Title>{file.name}</Title>
    </div>
  );
};

export default ThumbnailImage;
