import * as React from 'react';

export default class TrackInformation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { track } = this.props;
    const { name, artist } = track;
    return (
      <div className="TrackInformation">
        <div className="Name">{name}</div>
        <div className="Artist">{artist}</div>
      </div>
    );
  }
}
