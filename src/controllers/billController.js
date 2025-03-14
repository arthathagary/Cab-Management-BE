const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Customer = require("../models/Customer");
const Car = require("../models/Car");
const PDFDocument = require("pdfkit");


const generateBill = async (req, res) => {
  try {
    // Extract bookingId from route parameters
    const { bookingId } = req.params;

    // Fetch booking and populate associated customer, car, and driver details
    const booking = await Booking.findById(bookingId)
      .populate("customer")
      .populate("car")
      .populate("driver");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Generate a unique bill id using mongoose ObjectId
    const billId = new mongoose.Types.ObjectId();

    // Build bill object
    const bill = {
      billId,
      bookingId: booking._id,
      issuedOn: new Date(),
      customer: booking.customer ? {
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone,
        address: booking.customer.address || "",
      } : {},
      trip: {
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        date: booking.createdAt,
      },
      car: booking.car ? {
        model: booking.car.model,
        plateNumber: booking.car.plateNumber,
      } : null,
      driver: booking.driver ? {
        id: booking.driver._id,
        name: booking.driver.name
      } : null,
      fare: booking.fare,
      bookingStatus: booking.status,
    };

    return res.status(200).json({ bill });
  } catch (error) {
    console.error("Error generating bill:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const downloadBill = async (req, res) => {
    try {
      const { bookingId } = req.params;
      const booking = await Booking.findById(bookingId)
        .populate("customer")
        .populate("car")
        .populate("driver");
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      const billId = new mongoose.Types.ObjectId();
  
      const bill = {
        billId: billId.toString(),
        bookingId: booking._id.toString(),
        issuedOn: new Date().toString(),
        customer: booking.customer ? {
          name: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone,
          address: booking.customer.address || "",
        } : {},
        trip: {
          pickupLocation: booking.pickupLocation,
          dropLocation: booking.dropLocation,
          date: booking.createdAt.toString(),
        },
        car: booking.car ? {
          model: booking.car.model,
          plateNumber: booking.car.plateNumber,
        } : null,
        driver: booking.driver ? {
          id: booking.driver._id.toString(),
          name: booking.driver.name || ""
        } : null,
        fare: booking.fare,
        bookingStatus: booking.status,
      };
  
      // Create a PDF document
      const doc = new PDFDocument();
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader("Content-disposition", `attachment; filename=bill_${billId}.pdf`);
        res.setHeader("Content-Type", "application/pdf");
        return res.status(200).send(pdfData);
      });
  
      // PDF Content
      doc.fontSize(20).text("Bill Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Bill ID: ${bill.billId}`);
      doc.text(`Booking ID: ${bill.bookingId}`);
      doc.text(`Issued On: ${bill.issuedOn}`);
      doc.moveDown();
      
      doc.fontSize(14).text("Customer Details:");
      doc.fontSize(12).text(`Name: ${bill.customer.name || "N/A"}`);
      doc.text(`Email: ${bill.customer.email || "N/A"}`);
      doc.text(`Phone: ${bill.customer.phone || "N/A"}`);
      doc.text(`Address: ${bill.customer.address || "N/A"}`);
      doc.moveDown();
      
      doc.fontSize(14).text("Trip Details:");
      doc.fontSize(12).text(`Pickup Location: ${bill.trip.pickupLocation}`);
      doc.text(`Drop Location: ${bill.trip.dropLocation}`);
      doc.text(`Date: ${bill.trip.date}`);
      doc.moveDown();
      
      doc.fontSize(14).text("Car Details:");
      if (bill.car) {
        doc.fontSize(12).text(`Model: ${bill.car.model}`);
        doc.text(`Plate Number: ${bill.car.plateNumber}`);
      } else {
        doc.fontSize(12).text("Car details not available");
      }
      doc.moveDown();
      
      doc.fontSize(14).text("Driver Details:");
      if (bill.driver) {
        doc.fontSize(12).text(`Driver ID: ${bill.driver.id}`);
        doc.fontSize(12).text(`Driver Name: ${bill.driver.name}`);
      } else {
        doc.fontSize(12).text("Driver details not available");
      }
      doc.moveDown();
      
      doc.fontSize(14).text("Fare & Booking Status:");
      doc.fontSize(12).text(`Fare: ${bill.fare}`);
      doc.text(`Booking Status: ${bill.bookingStatus}`);
  
      doc.end();
    } catch (error) {
      console.error("Error downloading bill as PDF:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
  module.exports = { generateBill, downloadBill };