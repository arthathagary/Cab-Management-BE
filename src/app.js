const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors())

app.use(express.json());

app.get("/", (req, res) => res.send("🚀 Vehicle Reservation API Running..."));

const userRouter = require("./routes/userRoute");
const customerRouter = require("./routes/customerRoute");
const driverRouter = require("./routes/driverRoute");
const bookingRouter = require("./routes/bookingRoute");
const carRouter = require("./routes/carRoute");
const reviewRouter = require("./routes/reviewRoute");
const paymentRouter = require("./routes/paymentRoute");
const billRouter = require("./routes/billRoute");

app.use("/api/users", userRouter);
app.use("/api/customers", customerRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/cars", carRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/bill", billRouter);

module.exports = app;
