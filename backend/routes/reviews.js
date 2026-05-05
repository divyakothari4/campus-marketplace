const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get reviews for a seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const reviews = await Review.find({ sellerId: req.params.sellerId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { itemId, sellerId, rating, comment, buyerName } = req.body;
    
    const review = new Review({
      itemId,
      buyerId: req.userId,
      buyerName,
      sellerId,
      rating,
      comment
    });
    
    await review.save();
    
    // Update seller rating
    const allReviews = await Review.find({ sellerId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await User.findByIdAndUpdate(sellerId, {
      rating: avgRating,
      totalReviews: allReviews.length
    });
    
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for an item
router.get('/item/:itemId', async (req, res) => {
  try {
    const reviews = await Review.find({ itemId: req.params.itemId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;