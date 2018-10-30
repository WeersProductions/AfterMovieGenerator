const ffmpeg = require('fluent-ffmpeg');

const fs = require('fs');

const { IncomingForm } = require('formidable');

const os = require('os');

const audioController = require('./audioController');

const db = require('../db');

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

      const videoData = createVideoData('media/video', filePaths);
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
  return getVideoData(req.params.videoId);
};

async function getVideoData(videoId) {
  const { rows } = await db.query('SELECT * FROM video WHERE video_id=$1', [videoId]);
  return rows[0];
}

async function createVideoData(fileType, filePaths) {
  const { rows } = await db.query(
    'with new_file as (insert into File (data_type) values ($1) returning file_id)  insert into video (file_id) values ((select file_id from new_file))',
    [fileType]
  );
  return rows[0];
}

async function updateVideoData(id, key, value) {
  const { rows } = await db.query(`UPDATE video SET ${key} = $2 WHERE video_id=$3`, [value, id]);
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
