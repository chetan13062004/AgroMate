'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  variant?: 'icon' | 'text';
}

export function WishlistButton({ 
  productId, 
  className,
  variant = 'icon'
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  if (variant === 'text') {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("text-sm gap-2", className)}
        onClick={handleClick}
      >
        <Heart 
          className={cn("h-4 w-4", {
            'fill-red-500 text-red-500': isWishlisted,
            'text-gray-400': !isWishlisted
          })} 
        />
        {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full hover:bg-gray-100", className)}
      onClick={handleClick}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={cn("h-5 w-5", {
          'fill-red-500 text-red-500': isWishlisted,
          'text-gray-400': !isWishlisted
        })} 
      />
    </Button>
  );
}
