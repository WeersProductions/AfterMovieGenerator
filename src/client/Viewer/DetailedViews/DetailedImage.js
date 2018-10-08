import * as React from 'react';
import styled from 'react-emotion';

const Container = styled('img')`
  max-width: 100%;
  height: auto;
`;

const Title = styled('div')`
  width: 90%;
  margin: 5px auto;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
`;

const DetailedImage = (props) => {
  const { file } = props;
  return (
    <div>
      <Container src={file.url} alt={file.name} />
    </div>
  );
};

export default DetailedImage;
