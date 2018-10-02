import * as React from 'react';

export default class Timestamps extends React.Component {
  constructor(props) {
    super(props);
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
    const {currentTime, duration} = this.props;
    return (
			<div className="Timestamps">
				<div className="Time Time--current">{this.convertTime(currentTime)}</div>
				<div className="Time Time--total">{this.convertTime(duration)}</div>
			</div>
		);
  }
}
