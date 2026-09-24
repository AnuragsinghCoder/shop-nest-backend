const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        required: true,
        default: "pending",
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    address: {
        type: String,
        required: true,
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentDate: {
        type: Date,
        required: true,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    trackingNumber: {
        type: String,
        required: true,
    },
    deliveryStatus: {
        type: String,
        required: true, 
        default: "pending",
        enum: ["pending", "delivered", "cancelled"],
    },
    paymentStatus: {
        type: String,
        required: true,
        default: "pending",
        enum: ["pending", "paid", "cancelled"],
    },
    
});
  module.exports = mongoose.model("Order", orderSchema);
    
    