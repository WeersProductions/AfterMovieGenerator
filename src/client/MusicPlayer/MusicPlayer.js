import * as React from 'react';
import TrackInformation from './TrackInformation';
import Scrubber from './Scrubber';
import Controls from './Controls';
import Timestamps from './Timestamps';
// import './MusicPlayer.css';
import styled from 'react-emotion';
import mediaTags from '../jsmediatags.min';

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

const Header = styled(`div`)`
  font-size: 1.5em;
  text-align: center;
  padding: 4px;
`;

const Player = styled('div')`
  background: #182530;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 10px -5px #121212;
  height: 667px;
  position: relative;
  width: 375px;
`;

const Artwork = styled('div')`
  width: 300px;
  height: 300px;
  background-size: cover;
  background-position: center center;
  border-radius: 4px;
  margin: auto;
  box-shadow: 0 5px 10px -5px rgba(18, 18, 18, 0.25);
  position: relative;
  background-image: ${props => props.backgroundImage};
`;

const Title = styled(`div`)`
  width: 300px;
  margin: 50px auto;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
`;

const httpToStream = (url) => {
  return new Promise(resolve => {
    http.get(url, stream=> {
      resolve(stream);
    });
  });
};

export default class MusicPlayer extends React.Component {
  constructor(props) {    
    super(props);
    mediaTags.read(props.track.file, {
      onSuccess: (tag) => {
        console.log(tag.tags);
        if(tag.tags.year) {
          this.props.track.year = tag.tags.year;
        }
        if(tag.tags.title) {
          this.props.track.name = tag.tags.title;
        }
        if(tag.tags.picture) {
          this.props.track.picture = tag.tags.picture;
        }
        this.setState({track: this.props.track});
      },
      onError: (error) => {
        console.log(error);
      }
    });
    
    this.state = { 
      isPlaying: false,
      currentTime: 0,
      ...props };
  }

  componentDidMount() {
    this.setState({track : {...this.state.track, duration: this.audio.duration}});
    console.log(this.audio.duration);
  };

  updateTime = (timestamp) => {
    timestamp = Math.floor(timestamp);
    this.setState({ currentTime: timestamp });
  };

  updateScrubber = (percent) => {
    // Set scrubber width
    const innerScrubber = document.getElementById('scrubberProgress');
    innerScrubber.style.width = percent;
  };

  fadeAudioOut = (audioControl, interval) => {
    if(audioControl.volume > 0.0) {
      if(audioControl.volume < 0.30) {
        audioControl.volume = 0;
      } else {
        audioControl.volume -= 0.25;
      }
      return false;
    } else {
      audioControl.pause();
      return true;
    }
  }

  togglePlay = () => {
    let { isPlaying } = this.state;
    const audio = document.getElementById('audio');
    if (!isPlaying) {
      isPlaying = true;
      audio.play();
      audio.volume = 1;
      const that = this;
      setInterval(() => {
        const { currentTime } = audio;
        if(!that.props.track.duration) {
          that.props.track.duration = audio.duration;
        }
        const { duration } = that.props.track;
        
        // Calculatge percent of song
        const percent = `${(currentTime / duration) * 100}%`;
        that.updateScrubber(percent);
        that.updateTime(currentTime);
      }, 100);
    } else {
      isPlaying = false;
      let fadeAudio = setInterval(() => {
        if(this.state.isPlaying || this.fadeAudioOut(audio, fadeAudio)) {
          clearInterval(fadeAudio);
        }
      }, 200);
    }
    console.log(isPlaying);
    this.setState({ isPlaying });
  };



  render() {
    const {track} = this.props;
    const {picture, duration, url} = track;
    const {isPlaying, currentTime} = this.state;
    return (
      <Player>
        <Background backgroundImage= {`url(${picture})`} />
        <Header>
          <Title>Now playing</Title>
        </Header>
        <Artwork backgroundImage= {`url(${picture})`} />
        <TrackInformation track={this.props.track} />
        <Scrubber />
        <Controls isPlaying={isPlaying} onClick={this.togglePlay} />
        <Timestamps duration={duration} currentTime={currentTime} />
        <audio id="audio">
          <source src={url} ref={(element) => this.audio = element}/>
        </audio>
      </Player>
    );
  }
}
