import * as React from 'react';
import styled from 'react-emotion';
import { MdPlayArrow, MdPause } from 'react-icons/md/';

const Controls = styled('div')`
  position: absolute;
  bottom: 32px;
  pointer-events: none;
  margin: auto;
  left: 0;
  right: 0;
`;

const Button = styled('i')`
  height: 75px;
  width: 75px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 75px;
  box-shadow: 0 5px 10px 0px rgba(18, 18, 18, 0.125);
  margin: auto;
  pointer-events: all;

  color: #ffffff;
  opacity: 0.5;
  font-size: 24px;

  &:active {
    transform: scale(0.98);
    background: #ffffff;
  }
`;

const Scrubber = (props) => {
  const { isPlaying, onClick } = props;

  return (
    <Controls>
      <Button onClick={onClick} onKeyDown={onClick} tabIndex={0} role="button">
        {isPlaying ? <MdPause /> : <MdPlayArrow />}
      </Button>
    </Controls>
  );
};

export default Scrubber;
