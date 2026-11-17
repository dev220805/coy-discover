const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ['like', 'pass'],
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate swipes on the same profile by the same user
swipeSchema.index({ userId: 1, profileId: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);
