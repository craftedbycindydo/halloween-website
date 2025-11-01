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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Reset error state when contestant changes
  React.useEffect(() => {
    setImageError(false);
    setRetryCount(0);
  }, [contestant.id, contestant.imageUrl]);

  const handleImageError = () => {
    console.error(`Failed to load image for ${contestant.name} (Attempt ${retryCount + 1}/${maxRetries})`);
    
    if (retryCount < maxRetries) {
      // Retry loading the image after a brief delay
      setTimeout(() => {
        console.log(`Retrying image load for ${contestant.name}...`);
        setRetryCount(prev => prev + 1);
      }, 500); // Quick retry
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    if (imageError) {
      setImageError(false);
    }
    if (retryCount > 0) {
      console.log(`✅ Image loaded for ${contestant.name} after ${retryCount} retries`);
    }
  };

  const handleRetryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`🔄 Manual retry for ${contestant.name}`);
    setImageError(false);
    setRetryCount(0);
  };

  const shouldShowImage = contestant.imageUrl && !imageError;

  return (
    <Card 
      className="bg-gradient-to-br from-gray-900 to-black border-4 border-orange-500 shadow-2xl hover:shadow-orange-500/50 transition-shadow duration-300"
      style={style}
    >
      <CardContent className="p-2">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-purple-900 to-black flex items-center justify-center mb-2 border-2 border-orange-500 relative">
          {shouldShowImage ? (
            <img 
              key={`${contestant.id}-${retryCount}`}
              src={contestant.imageUrl} 
              alt={contestant.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
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

