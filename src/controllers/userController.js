const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Car = require("../models/Car");
const Driver = require("../models/Driver");
const Customer = require("../models/Customer");
const Booking = require("../models/Booking");

require("dotenv").config();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.countOfAll = async (req, res) => {
  try {
    const countOfUsers = await User.countDocuments();
    const countOfCars = await Car.countDocuments();
    const countOfDrivers = await Driver.countDocuments();
    const countOfCustomers = await Customer.countDocuments();
    const countOfBookings = await Booking.countDocuments();
    const count = {
      users: countOfUsers,
      cars: countOfCars,
      drivers: countOfDrivers,
      customers: countOfCustomers,
      bookings: countOfBookings,
    };
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    console.log("user",user);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch",isMatch);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "3h" }
    );

    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};