'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { HeartOff, ShoppingBag, Heart, Leaf, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function WishlistPage() {
  const { wishlist, loading, removeFromWishlist, addToWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const handleAddToCart = async (product: any) => {
    await addItem(product._id)
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart`,
    });
  };

  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">Products you have saved for later purchase</p>
      </div>

      <div className="flex justify-end mb-2">
        <Button variant="outline" asChild>
          <Link href="/products">
            <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
        </Button>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <HeartOff className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-2">Save items you love to your wishlist</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="relative h-48 bg-gray-100">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isInWishlist(product._id)) {
                      await removeFromWishlist(product._id);
                      toast({
                        title: "Removed from wishlist",
                        description: `${product.name} has been removed from your wishlist`,
                      });
                    } else {
                      await addToWishlist(product._id);
                      toast({
                        title: "Added to wishlist",
                        description: `${product.name} has been added to your wishlist`,
                      });
                    }
                  }}
                  className={`p-2 rounded-full shadow-md ring-1 ring-black/10 transition-colors
                    ${isInWishlist(product._id) 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-white/80 backdrop-blur hover:bg-gray-100'
                    }`}
                >
                  <Heart 
                    className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-white text-white' : 'text-gray-500'}`} 
                  />
                </button>
                {product.isOrganic && (
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Leaf className="h-3 w-3" />
                    <span>Organic</span>
                  </div>
                )}
              </div>
              <span className={`absolute top-2 left-2 text-xs font-medium px-2.5 py-1 rounded-full ${
                product.stock > (product.lowStockThreshold || 5) 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {product.stock > (product.lowStockThreshold || 5) ? 'In Stock' : 'Low Stock'}
              </span>
            </div>
            <CardContent className="p-4 flex flex-col flex-grow">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-lg font-bold text-green-700">₹{product.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {product.description || 'Fresh and organic product directly from farm'}
              </p>
              
              <div className="mt-auto">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={product.stock === 0}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}
    </div>
  );
}
