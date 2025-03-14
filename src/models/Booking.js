
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    fare: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "completed", "cancelled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);