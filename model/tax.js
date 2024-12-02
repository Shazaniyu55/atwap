const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    taxType: {
      type: String,
      enum: [
        'Annual Due',
        'Income Tax',
        'VAT',
        'State Tax',
        'LGA Tax',
        'Other Obligations',
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },

    paymentMethod: {
      type: String,
      enum: ['USSD', 'Bank Transfer', 'Card Payment'],
      required: true,
    },

    paymentProof: {
      type: String, // Store the path or URL of the uploaded proof file
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },

    state: {
      type: String,
      required: true,
    },

    lga: {
      type: String,
      required: true,
    },

    dueDate: {
      type: Date,
    },

    comments: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tax', taxSchema);
