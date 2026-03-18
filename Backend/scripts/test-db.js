const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  process.exit(1);
}

console.log('Attempting to connect...');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ MongoDB connection successful!');
  return mongoose.connection.close();
})
.then(() => {
  console.log('✅ Connection closed successfully');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
  console.error('💡 Possible issues:');
  console.error('   1. Wrong connection string');
  console.error('   2. IP not whitelisted in MongoDB Atlas');
  console.error('   3. Network/firewall blocking connection');
  console.error('   4. MongoDB Atlas cluster paused');
  process.exit(1);
});