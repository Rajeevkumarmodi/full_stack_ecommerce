import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  totalPaidAmount: {
    type: Number,
    required: true,
  },
  shippingDetails: {
    phoneNo: { type: Number, requried: true },
    houseNo: { type: String, requried: true },
    address: { type: String, requried: true },
    pinCode: { type: Number, requried: true },
    city: { type: String, requried: true },
    state: { type: String, requried: true },
  },
  status: {
    type: String,
    requried: true,
    enum: [
      "Processing",
      "Confirmed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Cancelled",
      "Refund",
    ],
    default: "Processing",
  },
  item: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        requried: true,
      },
      title: {
        type: String,
        required: true,
      },
      thumbnail: {
        type: String,
        required: true,
      },
      size: {
        type: String,
      },
      color: {
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      deliveryCharge: {
        type: Number,
        required: true,
      },
      GST: {
        type: String,
        requried: true,
      },
    },
  ],
  razorpay_payment_id: {
    type: String,
    requried: true,
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

module.exports = mongoose.model("order", orderSchema);
