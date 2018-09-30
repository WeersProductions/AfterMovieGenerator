import React, { Component } from 'react';
import './app.css';
import styled, { css } from 'react-emotion';
import { Column, Row } from 'simple-flexbox';
import DropZone from 'react-dropzone';
import ReactPlayer from 'react-player';
import MusicPlayer from './MusicPlayer';

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

const Thumbnail = styled('img')`
  width: 50%;
  height: auto;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Waveform = styled('img')`
  width: 100%;
  height: auto;
  padding: 4px;
  background-color: black;
`;

const DropZoneOwn = styled(DropZone)`
  padding: 1rem;
  border: 1px dashed #ddd;
  border-radius: 5px;

  &.active {
    border-width: 2px;
    border-color: #666;
    border-style: dashed;
    border-radius: 5px;
  };

  &.rejected {
    borderStyle: 'solid';
    borderColor: '#c66';
    backgroundColor: '#eee;
  };

  &.disabled {
    opacity: 0.5;
  };

  &.active {
    borderStyle: 'solid';
    borderColor: '#6c6';
    backgroundColor: '#eee';
  };
`;

export default class App extends Component {
  state = {
    waveform: null,
    songId: '',
    videoResult: null,
    files: []
  };

  componentDidMount() {
    this.setState({ songId: '5b91297d6534697f83afaf3e' });
    // fetch('/api/getUsername')
    //   .then(res => res.json())
    //   .then(result => this.setState({ waveform: result.username }));
  }

  setSongId = (event) => {
    this.setState({ songId: event.target.value });
  };

  setVideoResult = (video) => {
    this.setState({ videoResult: video });
  };

  getWaveForm = () => {
    const { songId } = this.state;
    console.log(`get waveform for songId: ${songId}`);

    this.setState({ waveform: `/api/waveform/${songId}.png` });
  };

  getMovie = () => {
    console.log('Movie!');
  };

  onDropFiles = (acceptedFiles, rejectedFiles) => {
    console.log(`Uploading ${acceptedFiles.length} files`);
    const newFiles = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      newFiles.push({
        type: acceptedFiles[i].type,
        url: acceptedFiles[i].preview,
        name: acceptedFiles[i].name,
        title: acceptedFiles[i].name,
        artist: ['unknown'],
        id: null
      });
    }

    const { files } = this.state;

    this.setState({
      files: [...files, ...newFiles]
    });
  };

  render() {
    const {
      waveform, songId, videoResult, files
    } = this.state;
    const filesDrawn = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.includes('image')) {
          filesDrawn.push(
            <div key={i}>
              <Thumbnail src={files[i].url} alt={files[i].name} />
            </div>
          );
        }
        if (files[i].type.includes('audio')) {
          filesDrawn.push(
            <div key={i}>
              <MusicPlayer src={files[i].url} />
            </div>
          );
        }
      }
    }

    return (
      <div>
        <Column flexGrow={1}>
          <Row horizontal="center">Title bar</Row>
          <Row>
            <Column flexGrow={1}>
              <Row>
                <Column flexGrow={1}>
                  <DropZoneOwn
                    onDrop={this.onDropFiles}
                    accept="image/*, audio/*"
                    activeClassName="active"
                    acceptClassName="accept"
                    disabledClassName="disabled"
                    rejectClassName="reject"
                    multiple={false}
                    disableClick={false}
                  >
                    <Column flexGrow={1}>
                      <Row horizontal="center">Drop audio/images</Row>
                      {filesDrawn}
                    </Column>
                  </DropZoneOwn>
                </Column>

                <Column flexGrow={1}>
                  <Button primary onClick={this.getWaveForm}>
                    Upload music
                  </Button>
                </Column>
              </Row>

              <Row vertical="center">
                <Column flexGrow={1}>
                  <Input defaultValue="songId" onChange={this.setSongId} />
                </Column>
                <Column flexGrow={1}>
                  <Button primary onClick={this.getWaveForm}>
                    Get waveform
                  </Button>
                </Column>
              </Row>
              <Row>
                <Column flexGrow={1}>
                  <Button primary onClick={this.getMovie}>
                    Get movie
                  </Button>
                </Column>
              </Row>
            </Column>
            <Column flexGrow={1} vertical="center">
              {videoResult ? <ReactPlayer url={videoResult.preview} playing /> : <div />}
              {waveform ? <Waveform src={waveform} alt="waveform" /> : <div />}
            </Column>
          </Row>
        </Column>
      </div>
    );
  }
}
