const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning')
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.log('MongoDB connection error:', err));

// Sample users data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
    grade: 'Grade 10',
    studentId: 'STU0001'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'teacher@example.com',
    password: 'password123',
    role: 'teacher',
    department: 'Mathematics'
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'staff@example.com',
    password: 'password123',
    role: 'staff',
    department: 'Administration'
  },
  {
    firstName: 'Principal',
    lastName: 'Johnson',
    email: 'principal@example.com',
    password: 'password123',
    role: 'principal',
    department: 'School Administration'
  }
];

// Function to create users
const createSampleUsers = async () => {
  try {
    // Clear existing users (optional - remove this line if you want to keep existing users)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create new users
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n✅ Sample accounts created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👨‍🎓 Student Account:');
    console.log('   Email: student@example.com');
    console.log('   Password: password123');
    console.log('');
    console.log('👨‍🏫 Teacher Account:');
    console.log('   Email: teacher@example.com');
    console.log('   Password: password123');
    console.log('');
    console.log('👥 Staff Account:');
    console.log('   Email: staff@example.com');
    console.log('   Password: password123');
    console.log('');
    console.log('🏫 Principal Account:');
    console.log('   Email: principal@example.com');
    console.log('   Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('Error creating sample users:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
createSampleUsers();
