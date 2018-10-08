import * as React from 'react';
import styled from 'react-emotion';
import MusicPlayer from '../MusicPlayer/MusicPlayer';

const FileGrid = (props) => {
  const { file, multiple } = props;

  let fileDrawn = null;
  if (multiple) {
    fileDrawn = 'Multiple selected';
  }

  fileDrawn = <MusicPlayer track={file} />;

  return <div>{file ? fileDrawn : null}</div>;
};

export default FileGrid;
