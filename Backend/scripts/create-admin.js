const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import User model
const User = require('../src/models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // If admin exists, reset credentials to known defaults
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      existingAdmin.name = existingAdmin.name || 'Admin';
      existingAdmin.role = 'admin';
      existingAdmin.password = 'Admin@123';
      await existingAdmin.save();

      console.log('Existing admin updated successfully:');
      console.log('Email: admin@gmail.com');
      console.log('Password: Admin@123');
      process.exit(0);
    }

    // Create admin user (password will be hashed by User model middleware)
    await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'Admin@123',
      role: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@gmail.com');
    console.log('Password: Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
