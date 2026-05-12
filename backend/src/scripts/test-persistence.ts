import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

async function verifyPersistence() {
  console.log('--- Verification Started ---');

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nana');
    console.log('Connected to MongoDB');

    const email = `test-persistence-${Date.now()}@example.com`;
    const user = await User.create({
      name: 'Persistence Test',
      email: email,
      password: 'password123'
    });
    
    // Simulate update
    const profile = {
      dob: new Date('1990-01-01'),
      gender: 'male' as const,
      country: 'United Kingdom',
      bloodType: 'O+'
    };
    const healthInfo = {
      allergies: ['Peanuts'],
      chronicConditions: ['Asthma']
    };

    const foundUser = await User.findById(user._id);
    if (!foundUser) throw new Error('User not found');
    
    foundUser.profile = { ...foundUser.profile, ...profile };
    foundUser.healthInfo = { 
      allergies: healthInfo.allergies,
      chronicConditions: healthInfo.chronicConditions,
      medications: [],
      recentSymptoms: []
    };
    foundUser.onboardingComplete = true;
    
    await foundUser.save();

    const updatedUser = await User.findById(user._id);
    if (!updatedUser) throw new Error('User not found after update');

    console.log('Verifying...');
    if (updatedUser.profile.bloodType === 'O+' && updatedUser.healthInfo.allergies.includes('Peanuts') && updatedUser.onboardingComplete) {
      console.log('--- PERSISTENCE VERIFIED SUCCESSFULLY ---');
    } else {
      console.error('--- PERSISTENCE VERIFICATION FAILED ---');
    }

    await User.deleteOne({ _id: user._id });
    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

verifyPersistence();
