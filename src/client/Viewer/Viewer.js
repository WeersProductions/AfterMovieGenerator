import * as React from 'react';
import styled from 'react-emotion';
import MusicPlayer from '../MusicPlayer/MusicPlayer';

export default class FileGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {file} = this.props;

    let fileDrawn = (<MusicPlayer track={file}/>)

    return (
      <div>
          {file ? fileDrawn : null}
      </div>
    );
  }
}
