import React, { useState, useEffect } from 'react';
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
  const [hasVoted, setHasVoted] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [currentVote, setCurrentVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check vote status on mount
  useEffect(() => {
    checkVoteStatus();
  }, []);

  const checkVoteStatus = async () => {
    try {
      const status = await votesAPI.checkStatus();
      setHasVoted(status.hasVoted);
      if (status.vote) {
        setHasChanged(status.vote.hasChanged || status.vote.has_changed || false);
        setCurrentVote(status.vote.contestantId || status.vote.contestant_id || null);
        setVoterName(status.vote.voterName || status.vote.voter_name || '');
      }
    } catch (error) {
      console.error('Error checking vote status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!voterName.trim()) {
      setMessage('Please enter your name!');
      setShowDialog(true);
      return;
    }

    if (!selectedContestant) {
      setMessage('Please select a contestant!');
      setShowDialog(true);
      return;
    }

    try {
      const result = await votesAPI.submit(selectedContestant, voterName.trim());
      const contestantName = contestants.find(c => c.id === selectedContestant)?.name;
      
      if (result.changed) {
        setMessage(`Your vote has been changed to ${contestantName}! 🎃\n\n⚠️ Your vote is now locked. No more changes allowed!`);
        setHasChanged(true);
      } else {
        setMessage(`Thank you for voting for ${contestantName}! 👻\n\nYou can change your vote once if needed.`);
        setHasVoted(true);
      }
      
      setCurrentVote(selectedContestant);
      setShowDialog(true);
    } catch (error: any) {
      setMessage(error.message || 'Failed to submit vote');
      setShowDialog(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">👻</div>
          <h2 className="text-3xl font-bold text-orange-500">Loading...</h2>
        </div>
      </div>
    );
  }

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-8 bg-black/90 p-6 rounded-xl border-2 border-orange-500 shadow-2xl shadow-orange-900/50">
        <h2 className="text-3xl font-bold text-orange-500 mb-4 text-center">Cast Your Vote! 👻</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="voterName" className="text-purple-300">Your Name</Label>
            <Input
              id="voterName"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              placeholder="Enter your name..."
              className="bg-black border-orange-500 text-white placeholder:text-orange-400/50"
            />
            {hasVoted && !hasChanged && currentVote && (
              <p className="text-sm text-orange-400 mt-2">
                You've already voted for {contestants.find(c => c.id === currentVote)?.name}. 
                You can change your vote once!
              </p>
            )}
            {hasChanged && (
              <p className="text-sm text-red-400 mt-2 font-semibold">
                ⚠️ You have already changed your vote. No more changes allowed!
              </p>
            )}
          </div>

          <div>
            <Label className="text-purple-300">Select a Contestant</Label>
            <p className="text-sm text-purple-400 mb-2">Click on a card to select</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {contestants.map((contestant) => (
          <div
            key={contestant.id}
            className={`cursor-pointer transform transition-all duration-300 ${
              selectedContestant === contestant.id 
                ? 'scale-105 ring-4 ring-orange-500 rounded-xl' 
                : 'hover:scale-102'
            }`}
            onClick={() => setSelectedContestant(contestant.id)}
          >
            <ContestantCard contestant={contestant} />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleVote}
          size="lg"
          disabled={hasChanged}
          className={`text-white text-xl px-12 py-6 shadow-xl ${
            hasChanged 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-orange-500/50'
          }`}
        >
          {hasChanged ? 'Vote Locked 🔒' : hasVoted ? 'Change Vote (Last Chance) 🎃' : 'Submit Vote 👻'}
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-black border-orange-500 shadow-2xl shadow-orange-900/50">
          <DialogHeader>
            <DialogTitle className="text-orange-500 text-2xl">
              {hasVoted && selectedContestant ? 'Vote Changed!' : 'Vote Submitted!'}
            </DialogTitle>
            <DialogDescription className="text-orange-300/80 text-lg">
              {message}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

