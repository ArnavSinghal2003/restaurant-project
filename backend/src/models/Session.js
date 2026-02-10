import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 60
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true
    },
    sessionToken: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    mode: {
      type: String,
      enum: ['collective', 'individual'],
      default: 'collective'
    },
    participants: {
      type: [participantSchema],
      default: []
    },
    cartSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ items: [] })
    },
    status: {
      type: String,
      enum: ['active', 'checked_out', 'expired'],
      default: 'active'
    },
    expiresAt: {
      type: Date,
      required: true
    },
    lastActivityAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

sessionSchema.index({ sessionToken: 1 }, { unique: true });
sessionSchema.index({ restaurantId: 1, tableId: 1, status: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
