const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('Loading environment variables...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

// Import User model
const User = require('../src/models/User');

const createAdmin = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');

    // Connect to MongoDB with timeout
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log('✅ Connected to MongoDB successfully');

    // Check if admin exists
    console.log('Checking for existing admin user...');
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });

    if (existingAdmin) {
      console.log('Found existing admin, updating credentials...');
      existingAdmin.name = existingAdmin.name || 'Admin';
      existingAdmin.role = 'admin';
      existingAdmin.password = 'Admin@123'; // This will be hashed by pre-save middleware
      await existingAdmin.save();

      console.log('✅ Existing admin updated successfully!');
      console.log('📧 Email: admin@gmail.com');
      console.log('🔑 Password: Admin@123');
      console.log('👤 Role: admin');
    } else {
      console.log('Creating new admin user...');

      // Create admin user (password will be hashed by User model middleware)
      const newAdmin = await User.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'Admin@123',
        role: 'admin'
      });

      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@gmail.com');
      console.log('🔑 Password: Admin@123');
      console.log('👤 Role: admin');
      console.log('🆔 ID:', newAdmin._id);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating/updating admin:', error.message);

    if (error.name === 'MongooseServerSelectionError') {
      console.error('💡 This usually means:');
      console.error('   - MongoDB connection string is incorrect');
      console.error('   - MongoDB Atlas IP whitelist doesn\'t include your IP');
      console.error('   - MongoDB service is down');
      console.error('   - Network connectivity issues');
    }

    process.exit(1);
  }
};

console.log('Starting admin creation script...');
createAdmin();
