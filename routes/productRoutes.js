const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const {
  authenticateAccessToken,
} = require("../middlewares/authenticateAccessToken");
const { isAdmin } = require("../middlewares/isAdmin");

router.get("/", authenticateAccessToken, async (req, res) => {
    const page = parseInt(req.query.page)||1;
    const item_count = parseInt(req.query.item_count)||10;
  
  
    const skip = (page-1)*item_count;
    const totalItems  = await Product.countDocuments();
    const totalPages = Math.ceil(totalItems/item_count);
   try {
      const products = await Product.find().skip(skip).limit(item_count)
      res.json(products,page,totalPages);
   } catch (error) {
      res.json({message:error})}
   

});

router.post("/create", authenticateAccessToken, async (req, res) => {
  try {
    const { title, description, price, category,stock, imageUrl } = req.body;
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      stock,
      imageUrl,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/edit/:id", authenticateAccessToken,isAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock:req.body.stock,
      imageUrl: req.body.imageUrl,
      currency:req.body.currency
    });

    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

router.delete("/delete/:id", authenticateAccessToken, async (req, res) => {
  const status = await Product.findByIdAndDelete(req.params.id);
  res.json(status ? "Product deleted" : "Error");
});

router.get("/search/:searchTerm", async (req, res) => {
    try{
        const searchTerm = req.params.searchTerm;
        const results = await Product.find({
            $or: [
                { title: { $regex: searchTerm, $options: "i" }},
                { description: { $regex: searchTerm, $options: "i"}},
            ],
        });

        res.json(results);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;