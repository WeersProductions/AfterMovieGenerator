import * as React from 'react';

export default class Timestamps extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  convertTime = (timestamp) => {
    const minutes = Math.floor(timestamp / 60);
    let seconds = timestamp - minutes * 60;
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    timestamp = `${minutes}:${seconds}`;
    return timestamp;
  };

  render() {
    return (
      <div className="Scrubber">
        <div className="Scrubber-Progress" />
      </div>
    );
  }
}
