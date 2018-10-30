import React, { Component } from 'react';
import './app.css';
import styled from 'react-emotion';
import { Column, Row } from 'simple-flexbox';
import DropZone from 'react-dropzone';
import ReactPlayer from 'react-player';

import FileGrid from './Explorer/FileGrid';
import Viewer from './Viewer/Viewer';

const API_KEY = '724147129031-k64gv5b60hrm7tafslgk8te0ui8q07k9.apps.googleusercontent.com';

const loadGoogleAPI = () => {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/client.js';

  script.onload = () => {
    gapi.load('client', () => {
      gapi.client.setApiKey(API_KEY);
      gapi.client.load('youtube', 'v3', () => {
        this.setState({ gapiReady: true });
      });
    });
  };

  document.body.appendChild(script);
};

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
  }

  &.rejected {
    border-style: 'solid';
    border-color: '#c66';
    background-color: '#eee';
  }

  &.disabled {
    opacity: 0.5;
  }

  &.active {
    border-style: 'solid';
    border-color: '#6c6';
    background-color: '#eee';
  }
`;

export default class App extends Component {
  state = {
    waveform: null,
    songId: '',
    videoResult: null,
    files: [],
    currentSelected: null
  };

  componentDidMount() {
    this.setState({ songId: '5b91297d6534697f83afaf3e' });
    loadGoogleAPI();
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
    console.log(acceptedFiles);
    console.log(`Uploading ${acceptedFiles.length} files`);
    const newFiles = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      newFiles.push({
        type: acceptedFiles[i].type,
        url: acceptedFiles[i].preview,
        name: acceptedFiles[i].name,
        artist: 'unknown',
        id: null,
        file: acceptedFiles[i],
        offline: true
      });
    }

    // TODO: extract this as a seperate method
    // Upload the new dropped files to the server!
    const xmlHttpRequest = new XMLHttpRequest();
    const uploadFormData = new FormData();
    const user = gapi.auth2.getAuthInstance().currentUser.get();
    const oauthToken = user.getAuthResponse().access_token;
    for (let i = 0; i < newFiles.length; i++) {
      uploadFormData.append(`file${i}`, acceptedFiles[i]);
    }
    xmlHttpRequest.addEventListener('load', (event) => {
      console.log('Stuff loaded', event);
    });

    xmlHttpRequest.addEventListener('error', (event) => {
      console.log('Something went wrong', event);
    });

    xmlHttpRequest.open('POST', '/api/audio', true);
    xmlHttpRequest.setRequestHeader('Authorization', `Bearer ${oauthToken}`);
    xmlHttpRequest.send(uploadFormData);

    const { files } = this.state;

    this.setState({
      files: [...files, ...newFiles]
    });
  };

  setSelected = (newSelected) => {
    this.setState({ currentSelected: newSelected });
    console.log('Selected', newSelected);
  };

  render() {
    const {
      waveform, songId, videoResult, files, currentSelected
    } = this.state;

    // {filesDrawn}
    return (
      <div>
        <Column flexGrow={1}>
          <Row horizontal="center">
            Title bar
            <div className="g-signin2" data-onsuccess="onSignIn" />
          </Row>
          <Row>
            <Column flexGrow={1}>
              <Row>
                <Column style={{ flex: '50%', maxWidth: '50%' }}>
                  <DropZoneOwn
                    onDrop={this.onDropFiles}
                    accept="image/*, audio/*"
                    activeClassName="active"
                    acceptClassName="accept"
                    disabledClassName="disabled"
                    rejectClassName="reject"
                    multiple
                    disableClick
                  >
                    <Column flexGrow={1}>
                      <Row horizontal="center">Drop audio/images</Row>
                      <FileGrid
                        onSelectedChange={newSelected => this.setSelected(newSelected)}
                        files={files}
                      />
                    </Column>
                  </DropZoneOwn>
                </Column>
                <Column style={{ flex: '50%', maxWidth: '50%' }}>
                  <Viewer file={currentSelected} />
                </Column>
              </Row>

              <Row vertical="center">
                <Button primary onClick={this.getWaveForm}>
                  Upload music
                </Button>
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
