import * as React from 'react';
import styled from 'react-emotion';
import ThumbnailImage from './Thumbnails/ThumbnailImage';
import ThumbnailAudio from './Thumbnails/ThumbnailAudio';
import Thumbnail from './Thumbnails/Thumbnail';

const FlexGrid = styled('div')`
  display: flex;
  flex-wrap: wrap;
  padding: 0 4px;
`;

const Column = styled('div')`
  @media screen and (max-width: 100px) {
    flex: 25%;
    max-width: 25%;
  }
  @media screen and (max-width: 600px) {
    flex: 50%;
    max-width: 50%;
  }
  padding: 4px;
`;

const FileGrid = (props) => {
  const { files } = props;

  const filesDrawn = [];
  if (files) {
    for (let i = 0; i < files.length; i++) {
      filesDrawn.push(
        <Column key={i}>
          <Thumbnail file={files[i]} />
        </Column>
      );
    }
  }

  return <FlexGrid>{filesDrawn}</FlexGrid>;
};

export default FileGrid;
