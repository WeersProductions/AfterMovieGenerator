import * as React from 'react';
import styled, { keyframes } from 'react-emotion';

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

const FadeIn = keyframes`
  from {
    color: transparent;
  }

  to {
    color: white;
  }
`;

const TimeIndicator = styled('div') `
  font-size: 12px;
  animation: ${FadeIn} 0.3s ease;
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
    console.log(duration);
    return (
			<TimeStampsContainer>
				<TimeIndicator>{this.convertTime(currentTime)}</TimeIndicator>
				{duration ? <TimeIndicator Fade={true}>{this.convertTime(duration)}</TimeIndicator> : <div/>}
			</TimeStampsContainer>
		);
  }
}
