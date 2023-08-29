const express = require('express');
const { ProductModel } = require('../model/product.model');
const { auth } = require('../authentication/auth');
const ProductRouter = express.Router();

// POST /listings: Add a new listing.
ProductRouter.post('/', auth, async (req, res) => {
    if (req.userType !== "seller") {
        return res.status(403).json({ message: "Only sellers can add products." });
    }

    try {
        const newListing = new ProductModel({
          ...req.body,
          seller: req.userId
        });
        
        await newListing.save();
        res.status(201).json({ msg: "Product added successfully!", newListing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// {
//     "title":"Daniel Klein",
//     "description":"Black and Golden in color",
//     "price":3500,
//     "brand":"Daniel Klein",
//     "location":"Delhi",
//     "image":"https://tse2.mm.bing.net/th?id=OIP.Nh_-SpJqG60W6zCS-ndpqwAAAA&pid=Api&P=0&h=180"
//     }

// GET /listings: Retrieve all active listings.
ProductRouter.get('/my-products', auth, async (req, res) => {
    if (req.userType !== "seller") {
        return res.status(403).json({ message: "Only sellers can view their products." });
    }

    try {
        const products = await ProductModel.find({ seller: req.userId }).populate('seller');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


ProductRouter.get('/', async (req, res) => {
    try {
        // Extract query parameters
        const { brand, location, search, sort } = req.query;

        // Filtering criteria
        let filterCriteria = { isActive: true };

        if (brand) {
            filterCriteria.brand = new RegExp(brand, 'i');
        }

        if (location) {
            filterCriteria.location = location;
        }

        // Search criteria
        if (search) {
            filterCriteria.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ];
        }

        // Sorting criteria
        let sortCriteria = {};
        if (sort) {
            const order = sort.startsWith('-') ? -1 : 1;
            const field = order === -1 ? sort.slice(1) : sort;
            sortCriteria[field] = order;
        }

        const listings = await ProductModel.find(filterCriteria).sort(sortCriteria);

        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// GET /listings/:id: Retrieve a specific listing by its ID.
ProductRouter.get('/:id', async (req, res) => {
    try {
        const listing = await ProductModel.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });
        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /listings/:id: Update a listing by its ID.
ProductRouter.patch('/:id', async (req, res) => {
    try {
        const updatedListing = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedListing) return res.status(404).json({ message: 'Listing not found' });
        res.json(updatedListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /listings/:id: Delete a specific listing.
ProductRouter.delete('/:id', async (req, res) => {
    try {
        const deletedListing = await ProductModel.findByIdAndDelete(req.params.id);
        if (!deletedListing) return res.status(404).json({ message: 'Listing not found' });
        res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = { ProductRouter };
