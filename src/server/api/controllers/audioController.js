const { IncomingForm } = require('formidable');

const fs = require('fs');

const pcm = require('pcm');

const Canvas = require('canvas');

const ffmpeg = require('fluent-ffmpeg');

const os = require('os');
const bpmControler = require('./bpmController');

const db = require('../db');

const FileHosting = require('../lib/fileHosting');
const UserController = require('../lib/userController');

const WIDTH = 1800;
const HEIGHT = 280;

let peaks; // Peak value for each pixel of the output image
let peakIdx = 0; // Current index into peak array
let totalMax = 0; // Highest value seen in the input
let curMax = 0; // Highest value seen for the current round
let sampleIdx = 0; // Current sample index
let interestingPoints;
const interestingPointMinimum = 0.1; // The minimum difference between samples to be interesting
let groupTotal = 0; // Total of the current group of samples
// Used to get an idea of whether a difference between samples is interesting
let groupTotalDifference = 0;
const groupSizeMax = 30;
// Current group size, will never be higher than the
// maximum and will be reset once an interesting point is found
let groupSize = 0;

const slideshowDuration = 3;

exports.get_song_from_database = async function getSongFromDatabase(songId) {
  const { rows } = await db.query('SELECT * FROM song WHERE id = $1', [songId]);

  return rows[0];
};

exports.get_song_waveform = async function getSongWaveform(req, res) {
  const song = await this.get_song_from_database(req.params.songId);
  console.log('song', song);
  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(
    createPNG(song.total_max, song.peaks, song.interesting_points, song.duration, song.beats),
    'binary'
  );
};

exports.get_song = function getSong(req, res) {
  // TODO: use await
  this.get_song_from_database(req.params.songId, (song) => {
    res.send({
      name: song.name,
      bpm: song.bpm,
      beats: song.beats,
      peaks: song.peaks,
      interestingPoints: song.interestingPoints,
      totalMax: song.totalMax,
      date: song.date,
      duration: song.duration,
      src: song.src
    });
  });
};

exports.read_audio = function readAudio(req, res) {
  const form = new IncomingForm();

  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else if (!files.file0) {
      console.log('No file received', files);
      res.send('No file received');
    } else {
      // Hot fix because we don't support multiple files upload
      const file = files.file0;
      console.log(file);

      file.buffer = fs.readFileSync(file.path);
      const songId = await createSongData(file.name, file, req.profile);

      // Return the new instance, with the id.
      res.send({ songId });

      // Uncomment this to automatically analyze the song.
      bpmControler.getBPM(file.buffer, (bpmData) => {
        updateSongData(songId, 'beats', bpmData.beats);
        updateSongData(songId, 'bpm', bpmData.tempo);
        deepAnalyzeSong(file.path, bpmData, songId);
      });
    }
  });
};

exports.reanalyze_audio = function reanalyzeAudio(req, res) {
  this.get_song_from_database(req.params.songId, (songData) => {
    console.log('songdata', songData);
    const filePath = `${os.tmpdir() + parseInt(Math.random() * 1000000, 10)}.mp3`;
    // fs.writeFileSync(filePath, songData.rawSong);
    deepAnalyzeSong(
      songData.src,
      {
        beats: songData.beats,
        bpm: songData.bpm
      },
      songData._id,
      () => {
        fs.unlinkSync(filePath);
      }
    );
    res.send(songData._id);
  });
};

exports.get_video_beats = function getVideoBeats(beats, amount) {
  const analyzedBeats = [];
  let lastUsedBeat = 0;
  let localAmount = amount;
  for (let i = 0; i < localAmount && i < beats.length; i += 1) {
    let duration = beats[i];
    if (i > 0) {
      duration -= beats[lastUsedBeat];
    }
    if (duration < slideshowDuration && i < beats.length - 1) {
      localAmount += 1;
      continue;
    }
    analyzedBeats.push(duration);
    lastUsedBeat = i;
  }
  return analyzedBeats;
};

function deepAnalyzeSong(filePath, bpmData, songId, onFinished) {
  peaks = new Array(WIDTH);
  peakIdx = 0;
  totalMax = 0;
  curMax = 0;
  sampleIdx = 0;
  interestingPoints = new Array(0);

  ffmpeg.ffprobe(filePath, (err, inputInfo) => {
    const sampleRate = inputInfo.streams[0].sample_rate;
    const { duration } = inputInfo.format;
    const samplesPerPeak = Math.round((duration * sampleRate) / WIDTH);

    const stereo = inputInfo.streams[0].channel_layout === 'stereo';
    pcm.getPcmData(
      filePath,
      { stereo, sampleRate },
      (sample, channel) => {
        const absSample = Math.abs(sample);
        if (absSample > curMax) {
          curMax = absSample;
        }

        if (++sampleIdx >= samplesPerPeak) {
          storePeak(duration, bpmData.beats);
        }
      },
      (pcmErr, output) => {
        if (pcmErr) {
          throw pcmErr;
        }
        if (sampleIdx > 0 && peakIdx < peaks.length) {
          storePeak(duration, bpmData.beats);
        }

        // updateSongData(songId, 'interesting_points', interestingPoints);
        // updateSongData(songId, 'peaks', peaks);
        // updateSongData(songId, 'total_max', totalMax);
        // updateSongData(songId, 'duration', duration);

        db.query(
          'UPDATE song SET interesting_points = $2, peaks = $3, total_max = $4, duration = $5 WHERE song_id=$1;',
          [songId, interestingPoints, peaks, totalMax, duration]
        );

        if (onFinished) {
          onFinished();
        }
      }
    );
  });
}

async function createSongData(name, file, owner) {
  const { rows } = await db.query(
    'with new_file as (insert into file (data_type) values ($1) returning file_id)  insert into song (file_id) values ((select file_id from new_file)) RETURNING song_id',
    [file.type]
  );

  console.log('createSongData', rows);

  FileHosting.sendFileToGCS(
    file,
    (uploadErr) => {
      if (uploadErr) {
        console.log(uploadErr);
      }
      console.log('uploadedFile', file);
      updateFileData(rows[0].song_id, 'src', file.cloudStoragePublicUrl);
    },
    owner
  );
  return rows[0].song_id;
}

async function updateSongData(id, key, value) {
  const { rows } = await db.query(`UPDATE song SET ${key} = $1 WHERE song_id=$2;`, [value, id]);
}

async function updateFileData(id, key, value) {
  const { rows } = await db.query(`UPDATE file SET ${key} = $1 WHERE file_id=$2;`, [value, id]);
}

function storePeak(duration, beats) {
  if (curMax > 0) {
    curMax = altLogMeter(coefficientTodB(curMax));
  } else {
    curMax = -altLogMeter(coefficientTodB(-curMax));
  }
  peaks[peakIdx] = curMax;

  checkInterestingPoint(peakIdx, duration, beats);

  peakIdx += 1;

  if (curMax > totalMax) totalMax = curMax;

  curMax = 0;
  sampleIdx = 0;
}

function checkInterestingPoint(peakId, duration, beats) {
  // Update total values
  const currentValue = peaks[peakId];
  groupTotal += currentValue;
  if (groupSize < groupSizeMax) {
    groupSize += 1;
  } else {
    groupTotal -= peaks[peakId - groupSize];
    groupTotalDifference -= Math.abs(peaks[peakId - groupSize + 1] - peaks[peakId - groupSize]);
  }

  // Calculate average
  const averageSample = groupTotal / groupSize;
  const averageDifference = groupTotalDifference / groupSize;
  const difference = Math.abs(currentValue - averageSample);
  if (difference > Math.max(averageDifference, interestingPointMinimum)) {
    // This point is special, it is different from others.
    // Try to get the nearest point that is in-rythm in seconds.
    const timeStamp = (peakId / peaks.length) * duration;
    const pointInRhythm = getPointInRhythm(timeStamp, beats);
    interestingPoints.push(pointInRhythm);
    groupSize = 1;
    groupTotal = currentValue;
    groupTotalDifference = difference;
  }
}

/**
 *
 * @param {Number} point Point in seconds
 * @param {[Number]} beats All beats with timestamps in seconds
 * @returns {Number} closest point in rhythm.
 */
function getPointInRhythm(point, beats) {
  if (point < beats[0]) {
    return beats[0];
  }
  if (point > beats[beats.length - 1]) {
    return beats[beats.length - 1];
  }

  let lo = 0;
  let hi = beats.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((hi + lo) / 2);

    if (point < beats[mid]) {
      hi = mid - 1;
    } else if (point > beats[mid]) {
      lo = mid + 1;
    } else {
      return beats[mid];
    }
  }
  // lo == hi + 1
  return beats[lo] - point < point - beats[hi] ? beats[lo] : beats[hi];
}

function log10(arg) {
  return Math.log(arg) / Math.LN10;
}

function logMeter(power, lowerdB, upperdB, nonLinearity) {
  return power < lowerdB ? 0 : ((power - lowerdB) / (upperdB - lowerdB)) ** nonLinearity;
}

function altLogMeter(power) {
  return logMeter(power, -192.0, 0.0, 8.0);
}

function coefficientTodB(coeff) {
  return 20.0 * log10(coeff);
}

function createPNG(totalMaxValue, peaksValues, interestingPointData, songDuration, beats) {
  const canvas = new Canvas(1800, 280);
  const context = canvas.getContext('2d');

  const gain = 1.0 / totalMaxValue;

  for (let i = 0; i < peaksValues.length; i += 1) {
    drawLine(context, i, null, peaksValues[i] * gain, 'white');
  }

  for (let i = 0; i < interestingPointData.length; i += 1) {
    const peakNumber = Math.round((interestingPointData[i] / songDuration) * peaksValues.length);
    drawLine(context, peakNumber, null, peaksValues[peakNumber] * gain, 'red');
  }

  for (let i = 0; i < beats.length; i += 1) {
    const peakNumber = Math.round((beats[i] / songDuration) * peaksValues.length);
    drawLine(context, peakNumber, null, peaksValues[peakNumber] * gain, 'blue');
  }

  return canvas.toBuffer();
}

function drawLine(context, offset, min, max, color) {
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(offset, 0);
  context.lineTo(offset, 0.5 * HEIGHT - 0.5 * HEIGHT * max);
  context.stroke();

  context.beginPath();
  context.moveTo(offset, HEIGHT);
  context.lineTo(offset, 0.5 * HEIGHT + 0.5 * HEIGHT * max);
  context.stroke();
}
