import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  onboardingComplete: boolean;
  profile: {
    dob?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    country?: string;
    bloodType?: string;
    emergencyContact?: {
      name: string;
      phone: string;
    };
  };
  healthInfo: {
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    recentSymptoms: string[];
  };
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: [true, 'Please provide a name'], trim: true },
    email: { 
      type: String, 
      required: [true, 'Please provide an email'], 
      unique: true, 
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: { 
      type: String, 
      required: [true, 'Please provide a password'], 
      minlength: 8,
      select: false 
    },
    onboardingComplete: { type: Boolean, default: false },
    profile: {
      type: {
        dob: Date,
        gender: { 
          type: String, 
          enum: ['male', 'female', 'other', 'prefer-not-to-say'] 
        },
        country: String,
        bloodType: String,
        emergencyContact: {
          name: String,
          phone: String,
        },
      },
      default: {}
    },
    healthInfo: {
      type: {
        allergies: { type: [String], default: [] },
        chronicConditions: { type: [String], default: [] },
        medications: { type: [String], default: [] },
        recentSymptoms: { type: [String], default: [] },
      },
      default: {}
    },
    avatar: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Compare password
UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
