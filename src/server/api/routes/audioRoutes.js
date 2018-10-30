const audioController = require('../controllers/audioController');
const oauth2 = require('../lib/oauth2');

module.exports = function audioRoute(app) {
  app.route('/api/audio').post(oauth2.required, audioController.read_audio);
  // .post(audioController.add_audio);

  app.route('/api/waveform/:songId.png').get(audioController.get_song_waveform);
  // .put(audioController.update_audio)
  // .delete(audioController.delete_audio);

  app.route('/api/:songId').get(oauth2.required, audioController.get_song);

  app.route('/api/update/:songId').get(audioController.reanalyze_audio);
};
