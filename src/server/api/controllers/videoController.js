const ffmpeg = require('fluent-ffmpeg');

const fs = require('fs');

const { IncomingForm } = require('formidable');

const os = require('os');

const mongoose = require('mongoose');

const audioController = require('./audioController');

const Song = mongoose.model('Songs');
const Video = mongoose.model('Videos');

exports.create_video = function createVideo(req, res) {
  const form = new IncomingForm();

  form.keepExtensions = true;
  form.multiples = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.send(err);
    } else if (!files) {
      res.send('No file received');
    } else {
      const filePaths = [];
      Object.values(files).forEach((value) => {
        filePaths.push(value.path);
      });
      //   for (const key in files) {
      //     const file = files[key];
      //     filePaths.push(file.path);
      //   }

      const videoData = createVideoData('new_video', filePaths);
      const videoId = videoData._id;

      // Send back the videoId, this way the client doesn't have to wait.
      res.send(videoId);

      const { songId } = req.params;

      // Prepare the files.
      let concatenateFileData = '';

      const filePathsLength = filePaths.length;
      const songData = audioController.get_song_from_database(songId, (song) => {
        const durations = audioController.get_video_beats(song.beats, filePathsLength);
        for (let i = 0; i < filePathsLength; i++) {
          const filePath = filePaths[i];
          concatenateFileData += `file '${filePath}'\n`;
          concatenateFileData += `duration ${durations[i]}\n`;
        }
        console.log(concatenateFileData);
        const concatenateFilePath = `${os.tmpdir}/list.txt`;

        fs.writeFileSync(concatenateFilePath, concatenateFileData);

        audioController.save_song_tmp(songId, (songPath) => {
          const command = ffmpeg();
          command.addInput(songPath);
          command.addInput(concatenateFilePath).inputOptions(['-safe 0', '-f concat']);

          ffmpegCreateVideo(command, () => {
            // Add the song to the videoData.
            updateVideoData(videoId, 'songId', songId);
            updateVideoData(videoId, 'videoPath', '/Users/fw/Desktop/outputVideo.mp4');
          });
        });
      });
    }
  });
};

exports.get_video = function getVideo(req, res) {
  getVideoData(req.params.videoId, (video) => {
    res.send(video);
  });
};

function getVideoData(videoId, onFound) {
  Video.findById(videoId, (err, video) => {
    if (err) {
      onFound(err);
    } else {
      onFound(video);
    }
  });
}

function createVideoData(name, filePaths) {
  const newInstance = new Video({
    name,
    filePaths
  });

  newInstance.save((err) => {
    if (err) {
      console.log(err);
    }
  });
  return newInstance;
}

function updateVideoData(id, key, value) {
  Video.findByIdAndUpdate(id, { [key]: value }, (err, server) => {
    if (err) {
      console.log(err);
    }
    if (!server) {
      console.log(
        "Video: Seems like it didn't find this id, creation is probably slower than this update."
      );
    }
  });
}

function ffmpegCreateVideo(command, onFinished) {
  command.videoCodec('libx264');
  command.output('/Users/fw/Desktop/outputVideo.mp4');
  command.size('640x480');
  command.outputOption('-pix_fmt yuv420p');
  command.outputFps(30);
  command.on('end', () => {
    console.log('Finished processing');
    onFinished();
  });
  command.run();
}
