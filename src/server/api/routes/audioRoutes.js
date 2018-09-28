const audioController = require('../controllers/audioController');

module.exports = function audioRoute(app) {
  app.route('/api/audio').post(audioController.read_audio);
  // .post(audioController.add_audio);

  app.route('/api/waveform/:songId.png').get(audioController.get_song_waveform);
  // .put(audioController.update_audio)
  // .delete(audioController.delete_audio);

  app.route('/api/:songId').get(audioController.get_song);

  app.route('/api/update/:songId').get(audioController.reanalyze_audio);
};
