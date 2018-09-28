import React, { Component } from 'react';
import './app.css';
import styled from 'react-emotion';
import { Column, Row } from 'simple-flexbox';

const Input = styled('input')`
  padding: 0.5em;
  margin: 0.5em;
  color: ${props => props.inputColor || 'palevioletred'};
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;

const Button = styled('button')`
  /* Adapt the colours based on primary prop */
  background: ${props => (props.primary ? 'palevioletred' : 'white')};
  color: ${props => (props.primary ? 'white' : 'palevioletred')};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

export default class App extends Component {
  state = {
    waveform: null,
    songId: ''
  };

  componentDidMount() {
    // fetch('/api/getUsername')
    //   .then(res => res.json())
    //   .then(result => this.setState({ waveform: result.username }));
  }

  setSongId = (event) => {
    this.setState({ songId: event.target.value });
  };

  getWaveForm = () => {
    const { songId } = this.state;
    console.log(`get waveform for songId: ${songId}`);

    this.setState({ waveform: `/api/waveform/${songId}.png` });
  };

  render() {
    // {username ? <h1>{`Hello ${username}`}</h1> : <h1>Hello.. please wait!</h1>}
    const { waveform, songId } = this.state;
    return (
      <div>
        <Column flexGrow={1}>
          <Row horizontal="center">
            {waveform ? <img src={waveform} alt="waveform" /> : <div />}
          </Row>
          <Row vertical="center">
            <Column flexGrow={1} horiztonal="center">
              <Input defaultValue="5b91297d6534697f83afaf3e" onChange={this.setSongId} />
            </Column>
            <Column flexGrow={1} horiztonal="center">
              <Button primary onClick={this.getWaveForm}>
                Get waveform
              </Button>
            </Column>
          </Row>
          <Row>
            <Button primary onClick={this.getWaveForm}>
              Get movie
            </Button>
          </Row>
        </Column>
      </div>
    );
  }
}
