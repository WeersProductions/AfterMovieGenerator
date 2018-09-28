import React, { Component } from 'react';
import './app.css';
import styled, { css } from 'react-emotion';
import { Column, Row } from 'simple-flexbox';
import DropZone from 'react-dropzone';
import MusicPlayer from 'react-responsive-music-player';
import ReactPlayer from 'react-player';

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
    images: null,
    music: null,
    videoResult: null
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

  onDropMovieFiles = (acceptedFiles, rejectedFiles) => {
    console.log(`Uploading ${acceptedFiles.length} video files`);
    this.setState({
      images: acceptedFiles
    });
  };

  onDropAudioFiles = (acceptedFiles, rejectedFiles) => {
    console.log(`Uploading ${acceptedFiles.length} audio files`);
    console.log(acceptedFiles);
    this.setState({
      music: acceptedFiles
    });
  };

  render() {
    const {
      waveform, songId, images, videoResult
    } = this.state;
    let { music } = this.state;
    const imagesDrawn = [];
    if (images) {
      for (let i = 0; i < images.length; i++) {
        console.log(images[i].preview);
        imagesDrawn.push(
          <div key={i}>
            <Thumbnail src={images[i].preview} alt={images[i].name} />
          </div>
        );
      }
    }
    if (music && !music.url) {
      music = { url: music[0].preview, artist: ['unknown'], title: music[0].name };
    }

    return (
      <div>
        <Column flexGrow={1}>
          <Row>{videoResult ? <ReactPlayer url={videoResult.preview} playing /> : <div />}</Row>
          <Row>
            <Column flexGrow={1}>
              <DropZoneOwn
                onDrop={this.onDropAudioFiles}
                accept="audio/*"
                activeClassName="active"
                acceptClassName="accept"
                disabledClassName="disabled"
                rejectClassName="reject"
                multiple={false}
                disableClick={music}
              >
                <Column flexGrow={1}>
                  <Row horizontal="center">Drop audio</Row>
                  {music ? <MusicPlayer playlist={[music]} /> : <div />}
                </Column>
              </DropZoneOwn>
            </Column>

            <Column flexGrow={1}>
              <Button primary onClick={this.getWaveForm}>
                Upload music
              </Button>
            </Column>
          </Row>
          <Row horizontal="center">
            {waveform ? <Waveform src={waveform} alt="waveform" /> : <div />}
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
              <DropZoneOwn
                onDrop={this.onDropMovieFiles}
                accept="image/*"
                activeClassName="active"
                acceptClassName="accept"
                disabledClassName="disabled"
                rejectClassName="reject"
              >
                <Column flexGrow={1}>
                  <Row horizontal="center">Drop images</Row>
                  {imagesDrawn}
                </Column>
              </DropZoneOwn>
            </Column>

            <Column flexGrow={1}>
              <Button primary onClick={this.getWaveForm}>
                Get movie
              </Button>
            </Column>
          </Row>
        </Column>
      </div>
    );
  }
}
