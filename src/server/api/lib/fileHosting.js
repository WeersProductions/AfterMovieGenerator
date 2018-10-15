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

function sendFileToGCS(localFile, onFinish, owner) {
  console.log(owner);
  if (!localFile) {
    onFinish();
    return;
  }

  const gcsname = Date.now() + localFile.name;
  const bucketFile = bucket.file(gcsname);

  const stream = bucketFile.createWriteStream({
    metadata: {
      contentType: localFile.type
    },
    resumable: false
  });

  stream.on('error', (err) => {
    localFile.cloudStorageError = err;
    onFinish(err);
  });

  stream.on('finish', () => {
    localFile.cloudStorageObject = gcsname;
    // bucketFile.makePublic().then(() => {
    //   localFile.cloudStoragePublicUrl = getPublicUrl(gcsname);
    //   onFinish();
    // });
    bucketFile.acl.add(
      {
        entity: owner.id,
        role: 'OWNER_ROLE'
      },
      (err, aclObject, apiResponse) => {
        if (err) {
          console.log(err);
        }
        console.log(aclObject);
        console.log(apiResponse);
        localFile.cloudStoragePublicUrl = getPublicUrl(gcsname);
        onFinish();
      }
    );
  });

  stream.end(localFile.buffer);
}
// [END process]

module.exports = {
  getPublicUrl,
  sendFileToGCS
};
