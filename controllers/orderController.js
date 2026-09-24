const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

    // get all orders
const getAllOrders = async (req, res) => {
        try {
            const orders = await Order.find();
            return res.status(200).json(orders);
        } catch (err) {
            return res.status(500).json({ message: "Error getting all orders" });
        }   
};

// get order by id
const getOrderById = async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
            return res.status(200).json(order);
        } catch (err) {
            return res.status(500).json({ message: "Error getting order by id" });
        }   
};

// create order
const createOrder = async (req, res) => {
        try {
            // Check body
            if (!req.body) {
                return res.status(400).json({
                    message: "No order data provided"
                });
            }

            const {
                user,
                products,
                totalPrice,
                status,
                quantity,
                address,
                deliveryDate,
                paymentMethod,
                paymentDate,
                isPaid,
                trackingNumber,
                deliveryStatus,
                paymentStatus
            } = req.body;
            //console.log(req.body);
            // Required fields
            if (!user || !products || !totalPrice || !status || !quantity || !address || !deliveryDate || !paymentMethod || !paymentDate || !isPaid || !trackingNumber || !deliveryStatus || !paymentStatus) {
                return res.status(400).json({
                    message: "User, products, totalPrice, status, quantity, address, deliveryDate, paymentMethod, paymentDate, isPaid, trackingNumber, deliveryStatus, paymentStatus are required"
                });
            }

            // Validate status
            if (!["pending", "delivered", "cancelled"].includes(status)) {
                return res.status(400).json({
                    message: "Status must be one of pending, delivered, cancelled"
                });
            }

            // Validate deliveryStatus
            if (!["pending", "delivered", "cancelled"].includes(deliveryStatus)) {
                return res.status(400).json({
                    message: "Delivery status must be one of pending, delivered, cancelled"
                });
            }

            // Validate paymentStatus
            if (!["pending", "paid", "cancelled"].includes(paymentStatus)) {
                return res.status(400).json({
                    message: "Payment status must be one of pending, paid, cancelled"
                });
            }

            // Validate paymentMethod
            if (!["cash", "credit", "debit"].includes(paymentMethod)) {
                return res.status(400).json({
                    message: "Payment method must be one of cash, credit, debit"
                });
            }

            // Validate deliveryDate
            if (deliveryDate < new Date()) {
                return res.status(400).json({
                    message: "Delivery date must be in the future"
                });
            }

            // Validate paymentDate
            if (paymentDate < new Date()) {
                return res.status(400).json({
                    message: "Payment date must be in the future"
                });
            }

            // Validate trackingNumber
            if (!trackingNumber) {
                return res.status(400).json({
                    message: "Tracking number is required"
                });
            }

            // Validate isPaid
            if (isPaid !== true && isPaid !== false) {
                return res.status(400).json({
                    message: "isPaid must be true or false"
                });
            }

            // Validate quantity
            if (Number.isNaN(quantity) || quantity < 0) {
                return res.status(400).json({
                    message: "Quantity must be a valid non-negative number"
                });
            }

            // Validate totalPrice
            if (Number.isNaN(totalPrice) || totalPrice < 0) {
                return res.status(400).json({
                    message: "Total price must be a valid non-negative number"
                });
            }

            // Validate products
            if (!Array.isArray(products)) {
                return res.status(400).json({
                    message: "Products must be an array"
                });
            }   

            // Validate products array
            if (products.length === 0) {
                return res.status(400).json({
                    message: "Products array cannot be empty"
                });
            }

            // Validate products array elements
            for (let i = 0; i < products.length; i++) {
                if (!mongoose.Types.ObjectId.isValid(products[i])) {
                    return res.status(400).json({
                        message: `Invalid product ID: ${products[i]}`
                    });
                }
            }

            const order = await Order.create({
                user,
                products,
                totalPrice,
                status,
                quantity,
                address,
                deliveryDate,
                paymentMethod,
                paymentDate,
                isPaid,
                trackingNumber,
                deliveryStatus,
                paymentStatus
            });

            return res.status(201).json({
                message: "Order created successfully",
                order
            });

        } catch (err) {

            console.error("Create order error:", err);

            return res.status(500).json({
                message: "Error creating order"
            });
        }       
};

// update order
const updateOrder = async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (order) {
                let products = [];
                if (req.body.products) {
                    products = req.body.products;
                }
                let totalPrice = order.totalPrice;
                if (req.body.totalPrice) {
                    totalPrice = req.body.totalPrice;
                }
                let status = order.status;
                if (req.body.status) {
                    status = req.body.status;
                }
                let quantity = order.quantity;
                if (req.body.quantity) {
                    quantity = req.body.quantity;
                }
                let address = order.address;
                if (req.body.address) {
                    address = req.body.address;
                }
                let deliveryDate = order.deliveryDate;
                if (req.body.deliveryDate) {
                    deliveryDate = req.body.deliveryDate;
                }
                let paymentMethod = order.paymentMethod;
                if (req.body.paymentMethod) {
                    paymentMethod = req.body.paymentMethod;
                }
                let paymentDate = order.paymentDate;
                if (req.body.paymentDate) {
                    paymentDate = req.body.paymentDate;
                }
                let isPaid = order.isPaid;
                if (req.body.isPaid) {
                    isPaid = req.body.isPaid;
                }
                let trackingNumber = order.trackingNumber;
                if (req.body.trackingNumber) {
                    trackingNumber = req.body.trackingNumber;
                }
                let deliveryStatus = order.deliveryStatus;
                if (req.body.deliveryStatus) {
                    deliveryStatus = req.body.deliveryStatus;
                }
                let paymentStatus = order.paymentStatus;
                if (req.body.paymentStatus) {
                    paymentStatus = req.body.paymentStatus;
                }   
                const order = await Order.findByIdAndUpdate(req.params.id, {
                    products,
                    totalPrice,
                    status,
                    quantity,
                    address,
                    deliveryDate,
                    paymentMethod,
                    paymentDate,
                    isPaid,
                    trackingNumber,
                    deliveryStatus,
                    paymentStatus
                });   
                return res.status(200).json({
                    message: "Order updated successfully",
                    order
                });
            } else {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Error updating order"
            });
        }           
};

// delete order
const deleteOrder = async (req, res) => {
        try {
            const order = await Order.findByIdAndDelete(req.params.id);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
            return res.status(200).json({ message: "Order deleted successfully" });
        } catch (err) {
            return res.status(500).json({ message: "Error deleting order" });
        }       
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };