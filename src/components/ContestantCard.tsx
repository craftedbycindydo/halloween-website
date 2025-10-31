import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './ui/card';
import { Contestant } from '../types';

interface ContestantCardProps {
  contestant: Contestant;
  votes?: number;
  style?: React.CSSProperties;
}

export const ContestantCard: React.FC<ContestantCardProps> = ({ contestant, votes, style }) => {
  return (
    <Card 
      className="bg-gradient-to-br from-gray-900 to-black border-4 border-orange-500 shadow-2xl hover:shadow-orange-500/50 transition-shadow duration-300"
      style={style}
    >
      <CardContent className="p-2">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-purple-900 to-black flex items-center justify-center mb-2 border-2 border-orange-500">
          {contestant.imageUrl ? (
            <img 
              src={contestant.imageUrl} 
              alt={contestant.name}
              className="w-full h-full object-cover"
            />
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

