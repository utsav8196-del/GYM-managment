const dotenv = require('dotenv');
const path = require('path');

// make sure environment variables from the project root .env are loaded
dotenv.config({ path: path.join(__dirname, '../../.env') });

// required variables
const requiredEnvs = ['MONGODB_URI', 'JWT_SECRET'];
requiredEnvs.forEach((name) => {
  if (!process.env[name]) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
};