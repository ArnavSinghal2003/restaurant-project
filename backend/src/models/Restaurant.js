import mongoose from 'mongoose';

const taxConfigSchema = new mongoose.Schema(
  {
    cgst: {
      type: Number,
      min: 0,
      default: 0
    },
    sgst: {
      type: Number,
      min: 0,
      default: 0
    },
    serviceTax: {
      type: Number,
      min: 0,
      default: 0
    },
    inclusiveOrExclusive: {
      type: String,
      enum: ['inclusive', 'exclusive'],
      default: 'exclusive'
    }
  },
  { _id: false }
);

const tipConfigSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true
    },
    defaultPercentOptions: {
      type: [Number],
      default: [0, 5, 10],
      validate: {
        validator(options) {
          return options.every((value) => value >= 0 && value <= 100);
        },
        message: 'Tip options must be between 0 and 100.'
      }
    }
  },
  { _id: false }
);

const paymentConfigSchema = new mongoose.Schema(
  {
    cashEnabled: {
      type: Boolean,
      default: true
    },
    onlineEnabled: {
      type: Boolean,
      default: false
    },
    provider: {
      type: String,
      enum: ['stripe', 'razorpay'],
      default: 'stripe'
    }
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 2,
      maxlength: 120
    },
    logoUrl: {
      type: String,
      trim: true
    },
    contact: {
      phone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      website: { type: String, trim: true }
    },
    address: {
      line1: { type: String, trim: true },
      line2: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: { type: String, trim: true }
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'INR',
      minlength: 3,
      maxlength: 3
    },
    taxConfig: {
      type: taxConfigSchema,
      default: () => ({})
    },
    tipConfig: {
      type: tipConfigSchema,
      default: () => ({})
    },
    paymentConfig: {
      type: paymentConfigSchema,
      default: () => ({})
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

restaurantSchema.index({ slug: 1 }, { unique: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
