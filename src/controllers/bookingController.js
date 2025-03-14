const Booking = require("../models/Booking");

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer")
      .populate("driver")
      .populate("car");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  const booking = new Booking({
    customer: req.body.customer,
    driver: req.body.driver,
    car: req.body.car,
    pickupLocation: req.body.pickupLocation,
    dropLocation: req.body.dropLocation,
    fare: req.body.fare,
    status: req.body.status,
  });

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.customer = req.body.customer || booking.customer;
    booking.driver = req.body.driver || booking.driver;
    booking.car = req.body.car || booking.car;
    booking.pickupLocation = req.body.pickupLocation || booking.pickupLocation;
    booking.dropLocation = req.body.dropLocation || booking.dropLocation;
    booking.fare = req.body.fare || booking.fare;
    booking.status = req.body.status || booking.status;

    const updatedBooking = await booking.save();
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.remove();
    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};