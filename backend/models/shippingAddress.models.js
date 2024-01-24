const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  houseNo: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
});

const Shipping = mongoose.model("Shipping", shippingSchema);

module.exports = Shipping;
