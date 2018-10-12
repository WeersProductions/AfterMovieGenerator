const { AudioContext } = require('web-audio-api');
const MusicTempo = require('music-tempo');

let onBPM;

const calcTempo = function calcTempo(buffer) {
  let audioData = [];
  // Take the average of the two channels
  if (buffer.numberOfChannels === 2) {
    const channel1Data = buffer.getChannelData(0);
    const channel2Data = buffer.getChannelData(1);
    const { length } = channel1Data;
    for (let i = 0; i < length; i++) {
      audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
    }
  } else {
    audioData = buffer.getChannelData(0);
  }
  const mt = new MusicTempo(audioData);

  // To get bpm: mt.temp
  // To get beat timestamps: mt.beats
  onBPM(mt);
};

const getBPM = function getBPM(data, onComplete) {
  onBPM = onComplete;
  const context = new AudioContext();
  context.decodeAudioData(data, calcTempo);
};

module.exports = {
  getBPM
};
