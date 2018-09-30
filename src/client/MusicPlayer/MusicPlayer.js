import * as React from 'react';

export default class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }

  getInitialState = () => ({
    playStatus: 'play',
    currentTime: 0
  });

  updateTime = (timestamp) => {
    timestamp = Math.floor(timestamp);
    this.setState({ currentTime: timestamp });
  };

  updateScrubber = (percent) => {
    // Set scrubber width
    const innerScrubber = document.querySelector('.Scrubber-Progress');
    innerScrubber.style.width = percent;
  };

  togglePlay = () => {
    let { playStatus } = this.state;
    const audio = document.getElementById('audio');
    if (playStatus === 'play') {
      playStatus = 'pause';
      audio.play();
      const that = this;
      setInterval(() => {
        const { currentTime } = audio;
        const { duration } = that.props.track;

        // Calculatge percent of song
        const percent = `${(currentTime / duration) * 100}%`;
        that.updateScrubber(percent);
        that.updateTime(currentTime);
      }, 100);
    } else {
      playStatus = 'play';
      audio.pause();
    }
    this.setState({ playStatus });
  };

  render() {
    return (
      <div className="Player">
        <div
          className="Background"
          style={{ backgroundImage: `url(${this.props.track.artwork})` }}
        />
        <div className="Header">
          <div className="Title">Now playing</div>
        </div>
        <div className="Artwork" style={{ backgroundImage: `url(${this.props.track.artwork})` }} />
        <TrackInformation track={this.props.track} />
        <Scrubber />
        <Controls isPlaying={this.state.playStatus} onClick={this.togglePlay} />
        <Timestamps duration={this.props.track.duration} currentTime={this.state.currentTime} />
        <audio id="audio">
          <source src={this.props.track.source} />
        </audio>
      </div>
    );
  }
}
