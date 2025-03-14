
const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["available", "booked", "maintenance"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);