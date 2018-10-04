import * as React from 'react';
import styled from 'react-emotion';
import TrackInformation from '../MusicPlayer/TrackInformation';

const Title = styled('div')`
  width: 90%;
  margin: 5px auto;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
`;

const Container = styled('div')`
  max-width: 250px;
  height: 250px;
  padding: 5px;
  vertical-align: middle;
`;

const Content = styled('div')`
  max-width: 250px;
  height: auto;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 8px;
  vertical-align: middle;
`;

const Artwork = styled('div')`
  max-width: 300px;
  max-height: 300px;
  background-size: cover;
  background-position: center center;
  border-radius: 4px;
  margin: auto;
  box-shadow: 0 5px 10px -5px rgba(18, 18, 18, 0.25);
  position: relative;
  background-image: ${props => props.backgroundImage};
`;

const Background = styled('div')`
  width: 150%;
  height: 150%;
  position: absolute;
  top: -25%;
  left: -25%;
  background-size: cover;
  background-position: center center;
  opacity: 0.2;
  filter: blur(10px);
  background-image: '${props => props.backgroundImage}';
`;

export default class ThumbnailAudio extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { file } = this.props;
    //<MusicPlayer track={file}/>
    return (
      <Container>
        <Content>
          <Artwork backgroundImage= {`url(${file.picture})`} />
          <Background backgroundImage= {`url(${file.picture})`} />
          <TrackInformation track={file}/>
        </Content>
        <Title>{file.name}</Title>
      </Container>
    );
  }
}
