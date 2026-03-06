#!/usr/bin/env node

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

console.log('Environment loaded');
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Import GalleryImage model
const GalleryImagePath = path.join(__dirname, '../src/models/GalleryImage.js');
const GalleryImage = require(GalleryImagePath);

console.log('Model loaded');

const galleryImages = [
  { title: 'Training Session 1', image: '/images/1.jpeg', order: 1 },
  { title: 'Training Session 2', image: '/images/2.jpeg', order: 2 },
  { title: 'Training Session 3', image: '/images/3.jpeg', order: 3 },
  { title: 'Training Session 4', image: '/images/4.jpeg', order: 4 },
  { title: 'Training Session 5', image: '/images/5.jpeg', order: 5 },
  { title: 'Training Session 6', image: '/images/6.jpeg', order: 6 },
  { title: 'Training Session 7', image: '/images/7.jpeg', order: 7 },
  { title: 'Training Session 8', image: '/images/8.jpeg', order: 8 },
  { title: 'Training Session 9', image: '/images/9.jpeg', order: 9 },
  { title: 'Training Session 10', image: '/images/10.jpeg', order: 10 },
];

const createGallery = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Delete existing gallery images
    console.log('Deleting existing images...');
    const deletedCount = await GalleryImage.deleteMany({});
    console.log(`✓ Deleted ${deletedCount.deletedCount} existing gallery images`);

    // Create new gallery images
    console.log('Creating 10 new gallery images...');
    const createdImages = await GalleryImage.insertMany(galleryImages);
    console.log(`✓ Successfully added ${createdImages.length} images to gallery`);

    createdImages.forEach((img, index) => {
      console.log(`  ${index + 1}. ${img.title} - ${img.image}`);
    });

    console.log('\n✓ Gallery images added successfully to MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating gallery:', error.message);
    process.exit(1);
  }
};

createGallery();
