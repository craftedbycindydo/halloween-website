import React, { useState } from 'react';
import { ContestantCard } from '../components/ContestantCard';
import { Contestant } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { votesAPI } from '../services/api';

interface VotePageProps {
  contestants: Contestant[];
}

export const VotePage: React.FC<VotePageProps> = ({ contestants }) => {
  const [voterName, setVoterName] = useState('');
  const [selectedContestant, setSelectedContestant] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleVote = async () => {
    if (!voterName.trim()) {
      setMessage('Please enter your name!');
      setIsError(true);
      setShowDialog(true);
      return;
    }

    if (!selectedContestant) {
      setMessage('Please select a contestant!');
      setIsError(true);
      setShowDialog(true);
      return;
    }

    try {
      await votesAPI.submit(selectedContestant, voterName.trim());
      const contestantName = contestants.find(c => c.id === selectedContestant)?.name;
      
      setIsError(false);
      setMessage(`Thank you for voting for ${contestantName}! 👻\n\nFeel free to vote again!`);
      setShowDialog(true);
      
      // Reset form after successful vote
      setSelectedContestant(null);
    } catch (error: any) {
      setMessage(error.message || 'Failed to submit vote');
      setIsError(true);
      setShowDialog(true);
    }
  };

  if (contestants.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-8xl mb-4">🎃</div>
          <h2 className="text-3xl font-bold text-orange-500 mb-2">No contestants to vote for yet!</h2>
          <p className="text-purple-300">Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-24">
      {/* Sticky vote form at top */}
      <div className="sticky top-0 z-40 bg-gradient-to-br from-black via-purple-950 to-black pb-4">
        <div className="max-w-4xl mx-auto bg-black/90 p-4 sm:p-6 rounded-xl border-2 border-orange-500 shadow-2xl shadow-orange-900/50">
          <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-3 sm:mb-4 text-center">Cast Your Vote! 👻</h2>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="voterName" className="text-purple-300 text-sm sm:text-base">Your Name</Label>
              <Input
                id="voterName"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                placeholder="Enter your name..."
                className="bg-black border-orange-500 text-white placeholder:text-orange-400/50"
              />
            </div>

            <div>
              <Label className="text-purple-300 text-sm sm:text-base">Select a Contestant</Label>
              <p className="text-xs sm:text-sm text-purple-400">Click on a card to select</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of contestants - 2 columns on mobile, responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4">
        {contestants.map((contestant) => (
          <div
            key={contestant.id}
            className={`cursor-pointer transform transition-all duration-300 ${
              selectedContestant === contestant.id 
                ? 'scale-105 ring-2 sm:ring-4 ring-orange-500 rounded-xl' 
                : 'hover:scale-102 active:scale-95'
            }`}
            onClick={() => setSelectedContestant(contestant.id)}
          >
            <ContestantCard contestant={contestant} />
          </div>
        ))}
      </div>

      {/* Fixed submit button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 sm:p-6 z-40">
        <div className="container mx-auto flex justify-center">
          <Button
            onClick={handleVote}
            size="lg"
            className="text-white text-base sm:text-xl px-8 sm:px-12 py-4 sm:py-6 shadow-xl w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-orange-500/50"
          >
            Submit Vote 👻
          </Button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-black border-orange-500 shadow-2xl shadow-orange-900/50">
          <DialogHeader>
            <DialogTitle className={`text-2xl ${isError ? 'text-red-500' : 'text-orange-500'}`}>
              {isError ? 'Oops! 👻' : 'Vote Submitted! 🎃'}
            </DialogTitle>
            <DialogDescription className={`text-lg ${isError ? 'text-red-300/80' : 'text-orange-300/80'}`}>
              {message}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

