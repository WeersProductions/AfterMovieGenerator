const { Storage } = require('@google-cloud/storage');
const config = require('../../config.js');

const CLOUD_BUCKET = config.get('CLOUD_BUCKET');

const storage = new Storage({
  projectId: config.get('GCLOUD_PROJECT'),
  keyFilename: '/Users/fw/Documents/Projects/AfterMovieGenerator/Keys/AfterMovieGenerator.json'
});

const bucket = storage.bucket(CLOUD_BUCKET);

// Returns the public, anonymously accessable URL to a given Cloud Storage
// object.
// The object's ACL ahs to be set to public read.
// [START public_url]
function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}
// [END public_url]

function sendFileToGCS(file, onFinish) {
  if (!file) {
    onFinish();
    return;
  }

  const gcsname = Date.now() + file.name;
  const bucketFile = bucket.file(gcsname);

  const stream = bucketFile.createWriteStream({
    metadata: {
      contentType: file.type
    },
    resumable: false
  });

  stream.on('error', (err) => {
    file.cloudStorageError = err;
    onFinish(err);
  });

  stream.on('finish', () => {
    file.cloudStorageObject = gcsname;
    bucketFile.makePublic().then(() => {
      file.cloudStoragePublicUrl = getPublicUrl(gcsname);
      onFinish();
    });
  });

  stream.end(file.buffer);
}
// [END process]

module.exports = {
  getPublicUrl,
  sendFileToGCS
};
