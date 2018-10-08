import * as React from 'react';
import styled from 'react-emotion';
import DetailedView from './DetailedViews/DetailedView';

const Viewer = (props) => {
  const { file, multiple } = props;

  let fileDrawn = null;
  if (multiple) {
    fileDrawn = 'Multiple selected';
  } else {
    fileDrawn = <DetailedView file={file} />;
  }

  return <div>{file ? fileDrawn : 'No file selected'}</div>;
};

export default Viewer;
