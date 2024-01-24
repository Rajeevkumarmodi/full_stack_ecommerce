const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  maxprice: {
    type: Number,
    required: true,
  },
  sellprice: {
    type: Number,
    required: true,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  color: [
    {
      type: String,
    },
  ],
  size: [
    {
      type: String,
    },
  ],
  GST: {
    type: Number,
    default: 0,
    required: true,
  },
  thumbnail: {
    public_id: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
      required: true,
    },
  },
  images: [
    {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
  ],
  reviews: [
    {
      reviewBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      username: { type: String },
      profilePic: { type: String },
      rating: { type: Number },
      comment: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("product", productSchema);
