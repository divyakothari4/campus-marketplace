const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get all items
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, condition, search } = req.query;
    let filter = { status: 'Available' };
    
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    item.views += 1;
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create item (requires auth)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, price, category, condition, images } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const item = new Item({
      title,
      description,
      price,
      category,
      condition,
      images: images || [],
      sellerId: req.userId,
      sellerName: user.username
    });
    
    await item.save();
    res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update item (requires auth)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (item.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
    
    const { title, description, price, category, condition, images, status } = req.body;
    
    if (title) item.title = title;
    if (description) item.description = description;
    if (price) item.price = price;
    if (category) item.category = category;
    if (condition) item.condition = condition;
    if (images) item.images = images;
    if (status) item.status = status;
    
    item.updatedAt = Date.now();
    await item.save();
    
    res.json({ message: 'Item updated successfully', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete item (requires auth)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (item.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }
    
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's items
router.get('/user/:userId', async (req, res) => {
  try {
    const items = await Item.find({ sellerId: req.params.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;