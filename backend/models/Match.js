const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    // Always store the logged-in (demo) user here for simpler queries
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    matchedProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      index: true,
    },
    // Sorted pair key prevents duplicate matches for the same two users
    pairKey: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

matchSchema.index({ userId: 1, matchedProfileId: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
