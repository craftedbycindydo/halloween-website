import React, { useState } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './ui/card';
import { Contestant } from '../types';

interface ContestantCardProps {
  contestant: Contestant;
  votes?: number;
  style?: React.CSSProperties;
}

export const ContestantCard: React.FC<ContestantCardProps> = ({ contestant, votes, style }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const maxRetries = 3;

  // Reset error state when contestant changes
  React.useEffect(() => {
    setImageError(false);
    setImageLoading(true);
    setRetryCount(0);
    
    // Try to get from localStorage first (cache)
    if (contestant.imageUrl) {
      const cacheKey = `img_cache_${contestant.id}`;
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached === contestant.imageUrl) {
          // Image is the same, use it
          setImageSrc(contestant.imageUrl);
        } else {
          // New or different image, update cache
          localStorage.setItem(cacheKey, contestant.imageUrl);
          setImageSrc(contestant.imageUrl);
        }
      } catch (err) {
        // localStorage might be full or disabled
        console.warn('Failed to cache image:', err);
        setImageSrc(contestant.imageUrl);
      }
    } else {
      setImageSrc(null);
    }
  }, [contestant.id, contestant.imageUrl]);

  const handleImageError = () => {
    console.error(`Failed to load image for ${contestant.name} (Attempt ${retryCount + 1}/${maxRetries})`);
    
    if (retryCount < maxRetries) {
      // Retry loading the image after a delay
      setTimeout(() => {
        console.log(`Retrying image load for ${contestant.name}...`);
        setRetryCount(prev => prev + 1);
        // Force reload by adding timestamp
        setImageSrc(contestant.imageUrl ? `${contestant.imageUrl}#retry${retryCount}` : null);
      }, 1000 * (retryCount + 1)); // Progressive delay: 1s, 2s, 3s
    } else {
      setImageError(true);
      setImageLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
    if (retryCount > 0) {
      console.log(`Image loaded successfully for ${contestant.name} after ${retryCount} retries`);
    }
  };

  const handleRetryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Manual retry for ${contestant.name}`);
    setImageError(false);
    setImageLoading(true);
    setRetryCount(0);
    setImageSrc(contestant.imageUrl ? `${contestant.imageUrl}#manual${Date.now()}` : null);
  };

  const shouldShowImage = imageSrc && !imageError;

  return (
    <Card 
      className="bg-gradient-to-br from-gray-900 to-black border-4 border-orange-500 shadow-2xl hover:shadow-orange-500/50 transition-shadow duration-300"
      style={style}
    >
      <CardContent className="p-2">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-purple-900 to-black flex items-center justify-center mb-2 border-2 border-orange-500 relative">
          {shouldShowImage ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-purple-900/50 z-10">
                  <div className="text-4xl animate-pulse">⏳</div>
                </div>
              )}
            <img 
                key={`${contestant.id}-${retryCount}`}
                src={imageSrc || ''} 
              alt={contestant.name}
              className="w-full h-full object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
                loading="lazy"
              />
            </>
          ) : imageError ? (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
              <div className="text-5xl">👻</div>
              <button
                onClick={handleRetryClick}
                className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-full transition-colors"
                title="Click to retry loading image"
              >
                🔄 Retry
              </button>
            </div>
          ) : (
            <div className="text-7xl">👻</div>
          )}
        </div>
        <div className="text-center space-y-0.5 px-1">
          <CardTitle className="text-orange-500 text-base font-extrabold">{contestant.name}</CardTitle>
          <CardDescription className="text-purple-400 text-xs font-semibold">{contestant.costume}</CardDescription>
        </div>
        {votes !== undefined && (
          <div className="mt-2 text-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg py-1.5 shadow-lg">
            <div className="text-xs font-bold text-white">
              🎃 {votes} {votes === 1 ? 'vote' : 'votes'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

