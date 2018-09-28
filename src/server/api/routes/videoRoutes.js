const videoController = require('../controllers/videoController');

module.exports = function videoRoutes(app) {
  app.route('/api/video/:songId').post(videoController.create_video);

  app.route('/api/getvideo/:videoId').get(videoController.get_video);
};
