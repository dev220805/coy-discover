const mongoose = require('mongoose');

/**
 * Discoverable public profile.
 * Linked 1:1 with a User. Feed and swipe APIs operate on Profile documents
 * so the public surface stays separate from account internals.
 */
const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    photo: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    interests: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

profileSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Profile', profileSchema);
