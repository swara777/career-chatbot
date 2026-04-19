const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Don't return password by default
    },
    currentStandard: {
      type: String,
      enum: ['10th', '12th', 'UG', 'Postgraduate', 'Professional'],
      required: true,
    },
    interests: {
      type: [String],
      enum: ['Tech', 'Arts', 'Medical', 'Law', 'Finance', 'Engineering', 'Business', 'Science'],
      default: [],
    },
    currentRoadmap: {
      careerId: mongoose.Schema.Types.ObjectId,
      careerTitle: String,
      startedAt: Date,
      progress: {
        skillsMastered: { type: Number, default: 0 },
        totalSkills: { type: Number, default: 0 },
      },
    },
    quizHistory: [
      {
        date: Date,
        results: {
          topMatch: String,
          matchScore: Number,
          allMatches: [
            {
              career: String,
              score: Number,
            },
          ],
        },
      },
    ],
    profilePicture: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);