const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('Loading environment variables...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

// Import Service model
const Service = require('../src/models/Service');

const createService = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');

    // Connect to MongoDB with timeout
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log('✅ Connected to MongoDB successfully');

    // Check if service exists
    console.log('Checking for existing service...');
    const existingService = await Service.findOne({ title: 'Service Page to Add' });

    if (existingService) {
      console.log('Found existing service, updating...');
      existingService.description = 'This is a service for adding services to the page';
      existingService.icon = 'Dumbbell';
      existingService.order = 1;
      existingService.shortText = 'Admin service management';
      existingService.highlights = ['Add Services', 'Manage Services', 'Admin Access'];
      await existingService.save();

      console.log('✅ Existing service updated successfully!');
    } else {
      console.log('Creating new service...');

      // Create service
      const newService = await Service.create({
        title: 'Service Page to Add',
        description: 'This is a service for adding services to the page',
        icon: 'Dumbbell',
        order: 1,
        shortText: 'Admin service management',
        highlights: ['Add Services', 'Manage Services', 'Admin Access']
      });

      console.log('✅ Service created successfully!');
      console.log('📝 Title: Service Page to Add');
      console.log('📄 Description: This is a service for adding services to the page');
      console.log('🎯 Icon: Dumbbell');
      console.log('🔢 Order: 1');
    }

    console.log('🎉 Service creation/update completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

createService();