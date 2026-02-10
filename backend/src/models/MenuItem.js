import mongoose from 'mongoose';

const modifierOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },
    priceDelta: {
      type: Number,
      default: 0
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const modifierGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    required: {
      type: Boolean,
      default: false
    },
    minSelect: {
      type: Number,
      min: 0,
      default: 0
    },
    maxSelect: {
      type: Number,
      min: 1,
      default: 1
    },
    options: {
      type: [modifierOptionSchema],
      default: []
    }
  },
  { _id: false }
);

const timeRuleSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 80 },
    startTime: { type: String, trim: true },
    endTime: { type: String, trim: true },
    daysOfWeek: {
      type: [Number],
      default: [],
      validate: {
        validator(days) {
          return days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6);
        },
        message: 'daysOfWeek must contain integers from 0 to 6.'
      }
    },
    priceOverride: { type: Number, min: 0 }
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 600
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    imageUrl: {
      type: String,
      trim: true
    },
    dietaryTags: {
      type: [String],
      default: []
    },
    modifiers: {
      type: [modifierGroupSchema],
      default: []
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    inventoryCount: {
      type: Number,
      min: 0
    },
    timeRules: {
      type: [timeRuleSchema],
      default: []
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ restaurantId: 1, isAvailable: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
