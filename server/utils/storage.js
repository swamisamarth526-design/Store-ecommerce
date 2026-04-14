const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const keys = require('../config/keys');
const isProduction = process.env.NODE_ENV === 'production';

const buildS3Url = (bucket, region, key) => {
  const encodedKey = encodeURIComponent(key).replace(/%2F/g, '/');
  return region === 'us-east-1'
    ? `https://${bucket}.s3.amazonaws.com/${encodedKey}`
    : `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
};

exports.s3Upload = async image => {
  try {
    let imageUrl = '';
    let imageKey = '';

    if (!keys.aws.accessKeyId || !keys.aws.secretAccessKey || !keys.aws.bucketName) {
      if (!isProduction) {
        console.warn('Missing AWS configuration: access keys or bucket name are not set.');
      }
      return { imageUrl, imageKey };
    }

    if (image) {
      const client = new S3Client({
        region: keys.aws.region || 'us-east-1',
        credentials: {
          accessKeyId: keys.aws.accessKeyId,
          secretAccessKey: keys.aws.secretAccessKey
        }
      });

      const params = {
        Bucket: keys.aws.bucketName,
        Key: image.originalname,
        Body: image.buffer,
        ContentType: image.mimetype
      };

      await client.send(new PutObjectCommand(params));

      imageUrl = buildS3Url(keys.aws.bucketName, keys.aws.region || 'us-east-1', image.originalname);
      imageKey = image.originalname;
    }

    return { imageUrl, imageKey };
  } catch (error) {
    return { imageUrl: '', imageKey: '' };
  }
};
