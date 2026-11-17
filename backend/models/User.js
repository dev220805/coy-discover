const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Age must be 18 or above'],
    },
    photo: {
      type: String,
      required: [true, 'Photo URL is required'],
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      trim: true,
      maxlength: [280, 'Bio cannot exceed 280 characters'],
    },
    city: {
      type: String,
      required: [true, 'City or college is required'],
      trim: true,
    },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one interest is required',
      },
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ isDemo: 1 });

module.exports = mongoose.model('User', userSchema);
