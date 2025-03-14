
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "card"],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);