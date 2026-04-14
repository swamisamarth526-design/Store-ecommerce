const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const isProduction = process.env.NODE_ENV === 'production';

const requiredEnv = (name, value) => {
  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }

  throw new Error(
    `Missing required environment variable ${name}. ` +
    `Create server/.env from server/.env.example or add ${name} to your environment.`
  );
};

const envOrDefault = (name, defaultValue) => {
  if (typeof process.env[name] === 'string' && process.env[name].trim() !== '') {
    return process.env[name];
  }

  return isProduction ? undefined : defaultValue;
};

module.exports = {
  app: {
    name: 'Mern Ecommerce',
    apiURL: `${process.env.BASE_API_URL}`,
    clientURL: process.env.CLIENT_URL
  },
  port: process.env.PORT || 3000,
  database: {
    url: requiredEnv(
      'MONGO_URI',
      envOrDefault('MONGO_URI', 'mongodb://127.0.0.1:27017/mern_ecommerce')
    )
  },
  jwt: {
    secret: requiredEnv(
      'JWT_SECRET',
      envOrDefault('JWT_SECRET', 'change_this_to_a_strong_secret')
    ),
    tokenLife: '7d'
  },
  mailchimp: {
    key: process.env.MAILCHIMP_KEY,
    listKey: process.env.MAILCHIMP_LIST_KEY
  },
  mailgun: {
    key: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    sender: process.env.MAILGUN_EMAIL_SENDER
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_BUCKET_NAME
  }
};
