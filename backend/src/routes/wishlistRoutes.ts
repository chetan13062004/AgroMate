import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from '../controllers/wishlistController.js'; // Note the .js extension - this is required

const router = Router();

// Protect all routes with authentication
router.use(protect);

router.route('/')
  .get(getWishlist)          // GET /api/wishlist - Get user's wishlist
  .post(addToWishlist);      // POST /api/wishlist - Add to wishlist

router.route('/:productId')
  .delete(removeFromWishlist); // DELETE /api/wishlist/:productId - Remove from wishlist

export default router;
