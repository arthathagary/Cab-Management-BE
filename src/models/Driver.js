
const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required
    : true, unique: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    experience: { type: Number },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "suspended"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);