import cloudinary from "../Lib/cloudinary.js";
import { Product } from "../Models/productModel.js";
import { TryCatch } from "../Utils/TryCatch.js";

export const getAllProductsOfAdmin = TryCatch(async (req, res) => {
    const products = await Product.find({});
    if (!products) {
        return res.status(404).json("No products found");
    }
    return res.status(200).json({ products });
});

export const getFeaturedProducts = TryCatch(async (req, res) => {
    const products = await Product.find({ isFeatured: true }).lean();
    if (!products) {
        return res.status(404).json("No Featured products found");
    }
    return res.status(200).json({ products });
})

export const getProductsByCategory = TryCatch(async (req, res) => {
    const { category } = req.params;
    const products = await Product.find({ category }).lean();
    if (!products) {
        return res.status(404).json("No products found with this category");
    }
    return res.status(200).json({ products });
});

export const getProductsByRecommedations = TryCatch(async (req, res) => {

    const products = await Product.aggregate([
        {
            $sample: { size: 10 }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                price: 1,
                image: 1,
                description: 1
            },
        },
    ]);
      
    if (!products) {
        return res.status(404).json("No products found for recommedations");
    }
    return res.status(200).json({ products });
});

export const createProduct = TryCatch(async (req, res) => {

    const { name, description, price, category, image } = req.body;

    if (!name || !description || !price || !category || !image) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const cloduinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
    const cloudinarySuccessfullResponse = cloduinaryResponse.secure_url ? cloduinaryResponse.secure_url : "";
    const product = await Product.create({
        name,
        description,
        price,
        category,
        image: cloudinarySuccessfullResponse
    });

    return res.status(201).json({ product, message: "Product created successfully" });

});

export const deleteProduct = TryCatch(async (req, res) => {

    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    const cloduinaryImageId = product.image.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(`products/${cloduinaryImageId}`);
    await Product.findByIdAndDelete(id);

    return res.json({ message: "Product deleted successfully" });

})

export const changeFeatured = TryCatch(async (req, res) => {

    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    return res.json({ updatedProduct });
})