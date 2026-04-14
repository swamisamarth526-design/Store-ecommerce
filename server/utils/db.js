const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const chalk = require('chalk');
const mongoose = require('mongoose');

const keys = require('../config/keys');
const { database } = keys;

const setupDB = async () => {
  const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };

  const tryConnect = async uri => {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect(uri, connectOptions);
  };

  try {
    // Connect to MongoDB
    await tryConnect(database.url);
    console.log(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected!')}`);
  } catch (error) {
    const fallbackUri = database.url.includes('://mongo')
      ? database.url.replace('://mongo', '://127.0.0.1')
      : null;

    if (fallbackUri) {
      console.warn(
        `${chalk.yellow('⚠')} MongoDB connection to host "mongo" failed, retrying on localhost...`
      );

      try {
        await tryConnect(fallbackUri);
        console.log(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected using localhost!')}`);
        return;
      } catch (fallbackError) {
        console.error(`${chalk.red('✗')} MongoDB connection failed on fallback:`, fallbackError.message || fallbackError);
      }
    }

    console.error(`${chalk.red('✗')} MongoDB connection failed:`, error.message || error);
    throw error;
  }
};

module.exports = setupDB;
