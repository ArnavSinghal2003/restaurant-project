import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    tableNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 4
    },
    qrToken: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });
tableSchema.index({ qrToken: 1 }, { unique: true });

const Table = mongoose.model('Table', tableSchema);

export default Table;
