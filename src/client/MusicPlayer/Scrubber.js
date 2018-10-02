import * as React from 'react';
import styled from 'react-emotion';

const ScrubberDiv = styled('div') `
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  opacity: 0.2;
  transition: opacity 0.25s ease;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const ScrubberProgress = styled('div')`
  background: -moz-linear-gradient(top, rgba(255, 71, 0, 0) 0%, #ff4700 100%);
  background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(255, 71, 0, 0)), color-stop(100%, #ff4700));
  background: -webkit-linear-gradient(top, rgba(255, 71, 0, 0) 0%, #ff4700 100%);
  background: -o-linear-gradient(top, rgba(255, 71, 0, 0) 0%, #ff4700 100%);
  background: -ms-linear-gradient(top, rgba(255, 71, 0, 0) 0%, #ff4700 100%);
  background: linear-gradient(to bottom, rgba(255, 71, 0, 0) 0%, #ff4700 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#ff4800", endColorstr="#ff4800", GradientType=0 );
  height: 100%;
  width: 0%;
  transition: width 0.25s ease;
  pointer-events: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export default class Scrubber extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrubberDiv>
        <ScrubberProgress id="scrubberProgress"/>
      </ScrubberDiv>
    );
  }
}
