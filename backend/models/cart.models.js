import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
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
    default: 0,
    required: true,
  },
  GST: {
    type: Number,
    default: 0,
    required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
