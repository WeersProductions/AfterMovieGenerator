import * as React from 'react';
import styled from 'react-emotion';

const Controls = styled('div') `
  position: absolute;
  bottom: 8%;
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

  color: #FFFFFF;
  opacity: 0.5;
  font-size: 24px;

   ${props => (props.play ? 'margin-left: 5px' : '')};
`;

export default class Scrubber extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {isPlaying, onClick } = this.props;

    return (
      <Controls>
        <div onClick={onClick} onKeyDown={onClick} tabIndex={0} role="button" className="Button">
          <Button play = {isPlaying === 'pause'}/>
        </div>
      </Controls>
    );
  }
}