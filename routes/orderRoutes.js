const express = require("express");
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} = require("../controllers/orderController");

const {
    protect,
    admin
} = require("../middilware/authMiddleware");

router.route("/").get(protect, admin, getAllOrders).post(protect, createOrder);
router.route("/:id").get(protect, getOrderById).put(protect, admin, updateOrder).delete(protect, admin, deleteOrder);
module.exports = router;