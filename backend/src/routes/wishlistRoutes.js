const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} = require('../controllers/wishlistController');

const router = express.Router();

// Protect all routes with authentication
router.use(protect);

router.route('/')
  .get(getWishlist)          // GET /api/wishlist - Get user's wishlist
  .post(addToWishlist);      // POST /api/wishlist - Add to wishlist

router.route('/:productId')
  .delete(removeFromWishlist); // DELETE /api/wishlist/:productId - Remove from wishlist

module.exports = router;
