const videoController = require('../controllers/videoController');
const oauth2 = require('../lib/oauth2');

module.exports = function videoRoutes(app) {
  app.route('/api/video/:songId').post(videoController.create_video);

  app.route('/api/getvideo/:videoId').get(oauth2.required, videoController.get_video);
};
