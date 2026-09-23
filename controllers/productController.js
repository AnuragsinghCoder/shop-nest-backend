const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ message: "Error getting all products" });
    }
};

// get product by id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json({ message: "Error getting product by id" });
    }
};

// create product (upload image)
const createProduct = async (req, res) => {
    try {

        // Check body
        if (!req.body) {
            return res.status(400).json({
                message: "No product data provided"
            });
        }

        const {
            name,
            description,
            price,
            category,
            stock,
            rating
        } = req.body;

        // Required fields
        if (!name || !description || !category) {
            return res.status(400).json({
                message: "Name, description and category are required"
            });
        }

        // Convert form-data strings to numbers
        const numericPrice = Number(price);
        const numericStock = Number(stock);
        const numericRating = rating !== undefined
            ? Number(rating)
            : 0;

        // Validate price
        if (
            Number.isNaN(numericPrice) ||
            numericPrice < 0
        ) {
            return res.status(400).json({
                message: "Price must be a valid non-negative number"
            });
        }

        // Validate stock
        if (
            Number.isNaN(numericStock) ||
            numericStock < 0
        ) {
            return res.status(400).json({
                message: "Stock must be a valid non-negative number"
            });
        }

        // Upload image
        let imageUrl = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        // Create product
        const product = await Product.create({
            name,
            description,
            price: numericPrice,
            category,
            stock: numericStock,
            rating: numericRating,
            image: imageUrl
        });

        return res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (err) {

        console.error("Create product error:", err);

        return res.status(500).json({
            message: "Error creating product"
        });
    }
};
        
// update product
const updateProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        category,
        stock,
        rating
    } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            let imageUrl = '';
            if (name !== undefined && product.name !== name) {
                product.name = name;
            }
            if (description !== undefined && product.description !== description) {
                product.description = description;
            }
            if (price !== undefined && product.price !== price) {
                product.price = price;
            }
            if (category !== undefined && product.category !== category) {
                product.category = category;
            }
            if (stock !== undefined && product.stock !== stock) {
                product.stock = stock;
            }
            if (rating !== undefined && product.rating !== rating) {
                product.rating = rating;
            }
            if (req.file) {
                if (req.file) {
                    const result = await cloudinary.uploader.upload(req.file.path);
                    imageUrl = result.secure_url;
                    product.image = result.secure_url;
                }
            }

            await product.save();

            return res.status(200).json({
                message: "Product updated successfully",
                product
            });

        } else {
            return res.status(404).json({
                message: "Product not found"
            });
        }

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Error updating product"
        });
    }
};

// delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting product" });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };