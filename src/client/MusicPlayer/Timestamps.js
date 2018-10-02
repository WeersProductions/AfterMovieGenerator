import * as React from 'react';
import styled from 'react-emotion';

const TimeStampsContainer = styled('div') `
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
  width: 100%;
`;

const TimeIndicator = styled('div') `
 font-size: 12px;
`;


export default class Timestamps extends React.Component {
  constructor(props) {
    super(props);
  }

  convertTime = (timestamp) => {
    const minutes = Math.floor(timestamp / 60);
    let seconds = Math.floor(timestamp - minutes * 60);
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    timestamp = `${minutes}:${seconds}`;
    return timestamp;
  };

  render() {
    const {currentTime, duration} = this.props;
    return (
			<TimeStampsContainer>
				<TimeIndicator>{this.convertTime(currentTime)}</TimeIndicator>
				<TimeIndicator>{this.convertTime(duration)}</TimeIndicator>
			</TimeStampsContainer>
		);
  }
}
