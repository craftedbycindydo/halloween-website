import React, { useState } from 'react';
import { Contestant, Vote } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, Plus, Eye, EyeOff, Trash2, Trophy, Gamepad2, Crown, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { votesAPI, gamesAPI, contestAPI } from '../services/api';

interface AdminPageProps {
  contestants: Contestant[];
  onAddContestant: (contestant: Contestant, adminPassword: string) => Promise<void>;
  onDeleteContestant: (id: string, adminPassword: string) => Promise<void>;
}

export const AdminPage: React.FC<AdminPageProps> = ({ 
  contestants, 
  onAddContestant,
  onDeleteContestant
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  
  // Add contestant form
  const [name, setName] = useState('');
  const [costume, setCostume] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Results dialog
  const [showResults, setShowResults] = useState(false);

  // Games
  const [games, setGames] = useState<any[]>([]);
  const [gameName, setGameName] = useState('');
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [selectedWinnerForGame, setSelectedWinnerForGame] = useState('');
  const [showGamesDialog, setShowGamesDialog] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [overallLeaderboard, setOverallLeaderboard] = useState<any[]>([]);
  const [gameWinners, setGameWinners] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'overall' | 'byGame'>('overall');

  // Contest Winner
  const [showContestWinner, setShowContestWinner] = useState(false);
  const [contestWinner, setContestWinner] = useState<any>(null);
  const [selectedContestWinner, setSelectedContestWinner] = useState('');

  // Check for existing session on mount
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const storedPassword = localStorage.getItem('halloween_admin_session');
        if (storedPassword) {
          const decrypted = atob(storedPassword);
          await votesAPI.getAll(decrypted);
          setAdminPassword(decrypted);
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('halloween_admin_session');
      } finally {
        setIsValidating(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await votesAPI.getAll(password);
      setAdminPassword(password);
      setIsAuthenticated(true);
      localStorage.setItem('halloween_admin_session', btoa(password));
      setError('');
      setPassword('');
    } catch (error: any) {
      setError('Invalid password! Try again, mortal! 👻');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPassword('');
    localStorage.removeItem('halloween_admin_session');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddContestant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !costume) {
      setError('Please fill in all fields');
      return;
    }

    const newContestant: Contestant = {
      id: `contestant-${Date.now()}`,
      name,
      costume,
      ...(imagePreview && { imageUrl: imagePreview }),
    };

    try {
      await onAddContestant(newContestant, adminPassword);
      setName('');
      setCostume('');
      setImagePreview('');
      const fileInput = document.getElementById('imageFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      setError(error.message || 'Failed to add contestant');
    }
  };

  const handleShowResults = async () => {
    try {
      const votesData = await votesAPI.getAll(adminPassword);
      setVotes(votesData);
      setShowResults(true);
    } catch (error: any) {
      setError(error.message || 'Failed to load results');
    }
  };

  // Games functions
  const loadGames = async () => {
    try {
      const gamesData = await gamesAPI.getAll();
      setGames(gamesData);
    } catch (error: any) {
      setError(error.message || 'Failed to load games');
    }
  };

  const loadLeaderboard = async () => {
    try {
      const leaderboard = await gamesAPI.getLeaderboard();
      setOverallLeaderboard(leaderboard);
    } catch (error: any) {
      setError(error.message || 'Failed to load leaderboard');
    }
  };

  const handleShowGames = async () => {
    await loadGames();
    setShowGamesDialog(true);
  };

  const handleCreateGame = async () => {
    if (!gameName.trim()) {
      setError('Please enter a game name');
      return;
    }

    try {
      await gamesAPI.create(gameName, adminPassword);
      setGameName('');
      await loadGames();
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to create game');
    }
  };

  const handleAddWinnerToGame = async (gameId: number) => {
    if (!selectedWinnerForGame) {
      setError('Please select a contestant');
      return;
    }

    try {
      await gamesAPI.addWinner(gameId, selectedWinnerForGame, adminPassword);
      setSelectedWinnerForGame('');
      await loadGames();
      if (selectedGame && selectedGame.id === gameId) {
        const winners = await gamesAPI.getGameWinners(gameId);
        setGameWinners(winners);
      }
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to add winner');
    }
  };

  const handleDeleteGame = async (gameId: number) => {
    try {
      await gamesAPI.deleteGame(gameId, adminPassword);
      await loadGames();
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to delete game');
    }
  };

  const handleShowLeaderboard = async () => {
    await loadGames();
    await loadLeaderboard();
    setShowLeaderboard(true);
  };

  const handleShowGameWinners = async (game: any) => {
    try {
      const winners = await gamesAPI.getGameWinners(game.id);
      setGameWinners(winners);
      setSelectedGame(game);
      setViewMode('byGame');
    } catch (error: any) {
      setError(error.message || 'Failed to load game winners');
    }
  };

  // Contest winner functions
  const loadContestWinner = async () => {
    try {
      const winner = await contestAPI.getWinner();
      setContestWinner(winner);
    } catch (error: any) {
      setError(error.message || 'Failed to load contest winner');
    }
  };

  const handleShowContestWinner = async () => {
    await loadContestWinner();
    setShowContestWinner(true);
  };

  const handleSetContestWinner = async (publish: boolean) => {
    if (!selectedContestWinner) {
      setError('Please select a contestant');
      return;
    }

    try {
      await contestAPI.setWinner(selectedContestWinner, publish, adminPassword);
      await loadContestWinner();
      setSelectedContestWinner('');
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to set contest winner');
    }
  };

  const handlePublishWinner = async () => {
    try {
      await contestAPI.setWinner(contestWinner.winner_id, true, adminPassword);
      await loadContestWinner();
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to publish winner');
    }
  };

  const handleUnpublishWinner = async () => {
    try {
      await contestAPI.unpublish(adminPassword);
      await loadContestWinner();
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to unpublish winner');
    }
  };

  const handleClearWinner = async () => {
    try {
      await contestAPI.clear(adminPassword);
      await loadContestWinner();
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to clear winner');
    }
  };

  const leaderboard = contestants
    .map(contestant => ({
      ...contestant,
      voteCount: votes.filter(v => (v.contestant_id || v.contestantId) === contestant.id).length
    }))
    .sort((a, b) => b.voteCount - a.voteCount);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">🎃</div>
          <h2 className="text-3xl font-bold text-orange-500">Validating...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md bg-black/90 border-orange-500 border-2 shadow-2xl shadow-orange-900/50">
          <CardHeader>
            <CardTitle className="text-3xl text-orange-500 flex items-center gap-2">
              <Lock className="w-8 h-8" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-purple-300">Enter Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password..."
                    className="bg-black border-orange-500 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                Enter
              </Button>
              <p className="text-xs text-purple-400 text-center">
                Enter the admin password to continue
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-4xl font-bold text-orange-500">Admin Dashboard 🎃</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Logout
          </Button>
        </div>

        {/* Add Contestant Form */}
        <Card className="bg-black/90 border-orange-500 border-2 shadow-2xl shadow-orange-900/50">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-500 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Add New Contestant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddContestant} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-purple-300">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contestant name..."
                  className="bg-black border-orange-500 text-white"
                />
              </div>
              <div>
                <Label htmlFor="costume" className="text-purple-300">Costume</Label>
                <Input
                  id="costume"
                  value={costume}
                  onChange={(e) => setCostume(e.target.value)}
                  placeholder="What are they dressed as..."
                  className="bg-black border-orange-500 text-white"
                />
              </div>
              <div>
                <Label htmlFor="imageFile" className="text-purple-300">Upload Image (optional, max 5MB)</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-black border-orange-500 text-white file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer overflow-hidden text-ellipsis"
                />
                {imagePreview && (
                  <div className="mt-2 relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-orange-500"
                    />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              const fileInput = document.getElementById('imageFile') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                          >
                            ×
                          </button>
                  </div>
                )}
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                Add Contestant
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* View Votes Results */}
          <Button 
            onClick={handleShowResults} 
            className="w-full bg-purple-600 hover:bg-purple-700 h-20 text-lg"
          >
            <Trophy className="w-6 h-6 mr-2" />
            View Votes
          </Button>

          {/* Games Leaderboard */}
          <Button 
            onClick={handleShowLeaderboard} 
            className="w-full bg-blue-600 hover:bg-blue-700 h-20 text-lg"
          >
            <Award className="w-6 h-6 mr-2" />
            Games Leaderboard
          </Button>

          {/* Manage Games */}
          <Button 
            onClick={handleShowGames} 
            className="w-full bg-green-600 hover:bg-green-700 h-20 text-lg"
          >
            <Gamepad2 className="w-6 h-6 mr-2" />
            Manage Games
          </Button>

          {/* Contest Winner */}
          <Button 
            onClick={handleShowContestWinner} 
            className="w-full bg-yellow-600 hover:bg-yellow-700 h-20 text-lg"
          >
            <Crown className="w-6 h-6 mr-2" />
            Contest Winner
          </Button>
        </div>

        {/* Contestants List */}
        <Card className="bg-black/90 border-orange-500 border-2 shadow-2xl shadow-orange-900/50">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-500">
              Current Contestants ({contestants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contestants.length === 0 ? (
              <p className="text-purple-300 text-center py-8">No contestants yet!</p>
            ) : (
              <div className="space-y-4">
                {contestants.map(contestant => (
                  <div 
                    key={contestant.id}
                    className="flex items-center justify-between bg-black/80 p-4 rounded-lg border border-orange-500/50"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative group">
                        {contestant.imageUrl ? (
                          <img 
                            src={contestant.imageUrl} 
                            alt={contestant.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-purple-900 rounded-lg flex items-center justify-center text-3xl">
                            👻
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-orange-400 font-bold">{contestant.name}</h3>
                        <p className="text-purple-300 text-sm">{contestant.costume}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                            <Button
                            onClick={async () => {
                              try {
                                await onDeleteContestant(contestant.id, adminPassword);
                                } catch (error: any) {
                                  setError(error.message || 'Failed to delete contestant');
                                }
                              }}
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              title="Delete contestant"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vote Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="bg-black border-orange-500 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl text-orange-500 flex items-center gap-2">
              <Trophy className="w-8 h-8" />
              Vote Leaderboard
            </DialogTitle>
            <DialogDescription className="text-purple-200">
              Total Votes: {votes.length}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {leaderboard.map((contestant, index) => (
              <div 
                key={contestant.id}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-2 border-yellow-500' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/30 to-gray-600/30 border-2 border-gray-400' :
                  index === 2 ? 'bg-gradient-to-r from-orange-700/30 to-orange-900/30 border-2 border-orange-700' :
                  'bg-purple-950/50 border border-purple-500/50'
                }`}
              >
                <div className="text-4xl font-bold text-orange-500 w-12 text-center">
                  #{index + 1}
                </div>
                {contestant.imageUrl ? (
                  <img 
                    src={contestant.imageUrl} 
                    alt={contestant.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-purple-900 rounded-lg flex items-center justify-center text-3xl">
                    👻
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-orange-400">{contestant.name}</h3>
                  <p className="text-purple-300 text-sm">{contestant.costume}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-500">{contestant.voteCount}</div>
                  <div className="text-sm text-purple-400">
                    {contestant.voteCount === 1 ? 'vote' : 'votes'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Games Leaderboard Dialog */}
      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="bg-black border-orange-500 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl text-orange-500 flex items-center gap-2">
              <Award className="w-8 h-8" />
              Games Leaderboard
            </DialogTitle>
          </DialogHeader>

          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setViewMode('overall')}
              variant={viewMode === 'overall' ? 'default' : 'outline'}
              className={viewMode === 'overall' ? 'bg-blue-600' : ''}
            >
              Overall Leaderboard
            </Button>
            <Button
              onClick={() => setViewMode('byGame')}
              variant={viewMode === 'byGame' ? 'default' : 'outline'}
              className={viewMode === 'byGame' ? 'bg-blue-600' : ''}
            >
              By Game
            </Button>
          </div>

          {viewMode === 'overall' ? (
            // Overall Leaderboard
            <div className="space-y-4">
              <h3 className="text-xl text-orange-400 font-bold">Overall Standings</h3>
              {overallLeaderboard.length === 0 ? (
                <p className="text-purple-300 text-center py-8">No game winners yet!</p>
              ) : (
                overallLeaderboard.map((contestant, index) => (
                  <div 
                    key={contestant.id}
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-2 border-yellow-500' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400/30 to-gray-600/30 border-2 border-gray-400' :
                      index === 2 ? 'bg-gradient-to-r from-orange-700/30 to-orange-900/30 border-2 border-orange-700' :
                      'bg-purple-950/50 border border-purple-500/50'
                    }`}
                  >
                    <div className="text-4xl font-bold text-orange-500 w-12 text-center">
                      #{index + 1}
                    </div>
                    {contestant.imageUrl ? (
                      <img 
                        src={contestant.imageUrl} 
                        alt={contestant.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-purple-900 rounded-lg flex items-center justify-center text-3xl">
                        👻
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-orange-400">{contestant.name}</h3>
                      <p className="text-purple-300 text-sm">{contestant.costume}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-500">{contestant.total_wins}</div>
                      <div className="text-sm text-purple-400">
                        {contestant.total_wins === 1 ? 'win' : 'wins'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // By Game View
            <div className="space-y-6">
              <div>
                <Label className="text-purple-300 mb-2 block">Select Game</Label>
                <select 
                  value={selectedGame?.id || ''}
                  onChange={(e) => {
                    const game = games.find(g => g.id === parseInt(e.target.value));
                    if (game) handleShowGameWinners(game);
                  }}
                  className="w-full bg-black border-orange-500 text-white p-2 rounded"
                >
                  <option value="">Choose a game...</option>
                  {games.map(game => (
                    <option key={game.id} value={game.id}>
                      {game.name} ({game.winner_count || 0} winners)
                    </option>
                  ))}
                </select>
              </div>

              {selectedGame && (
                <div className="space-y-4">
                  <h3 className="text-xl text-orange-400 font-bold">{selectedGame.name} - Winners</h3>
                  {gameWinners.length === 0 ? (
                    <p className="text-purple-300 text-center py-8">No winners for this game yet!</p>
                  ) : (
                    gameWinners.map((winner, index) => (
                      <div 
                        key={winner.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-purple-950/50 border border-purple-500/50"
                      >
                        <div className="text-2xl font-bold text-orange-500 w-8 text-center">
                          #{index + 1}
                        </div>
                        {winner.imageUrl ? (
                          <img 
                            src={winner.imageUrl} 
                            alt={winner.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center text-2xl">
                            👻
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-orange-400">{winner.name}</h3>
                          <p className="text-purple-300 text-sm">{winner.costume}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Games Dialog */}
      <Dialog open={showGamesDialog} onOpenChange={setShowGamesDialog}>
        <DialogContent className="bg-black border-orange-500 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl text-orange-500 flex items-center gap-2">
              <Gamepad2 className="w-8 h-8" />
              Manage Games
            </DialogTitle>
          </DialogHeader>

          {/* Create New Game */}
          <div className="space-y-4 border-b border-orange-500/50 pb-6">
            <h3 className="text-xl text-orange-400 font-bold">Create New Game</h3>
            <div className="flex gap-2">
              <Input
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Game name (e.g., Game 1, Musical Chairs, etc.)"
                className="bg-black border-orange-500 text-white flex-1"
              />
              <Button 
                onClick={handleCreateGame}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>

          {/* Games List */}
          <div className="space-y-4">
            <h3 className="text-xl text-orange-400 font-bold">Existing Games</h3>
            {games.length === 0 ? (
              <p className="text-purple-300 text-center py-8">No games created yet!</p>
            ) : (
              games.map(game => (
                <div 
                  key={game.id}
                  className="bg-purple-950/50 border border-purple-500/50 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-orange-400">{game.name}</h4>
                      <p className="text-sm text-purple-300">
                        {game.winner_count || 0} {game.winner_count === 1 ? 'winner' : 'winners'}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDeleteGame(game.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Add Winner to Game */}
                  <div className="flex gap-2 pt-2 border-t border-purple-500/30">
                    <select
                      value={selectedWinnerForGame}
                      onChange={(e) => setSelectedWinnerForGame(e.target.value)}
                      className="flex-1 bg-black border-orange-500 text-white p-2 rounded text-sm"
                    >
                      <option value="">Select winner...</option>
                      {contestants.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.costume})</option>
                      ))}
                    </select>
                    <Button
                      onClick={() => handleAddWinnerToGame(game.id)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Add Winner
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </DialogContent>
      </Dialog>

      {/* Contest Winner Dialog */}
      <Dialog open={showContestWinner} onOpenChange={setShowContestWinner}>
        <DialogContent className="bg-black border-orange-500 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl text-orange-500 flex items-center gap-2">
              <Crown className="w-8 h-8" />
              Contest Winner
            </DialogTitle>
            <DialogDescription className="text-purple-200">
              Set and publish the final contest winner (this will show only their card on the display page)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Winner Status */}
            {contestWinner && contestWinner.winner_id ? (
              <div className="bg-purple-950/50 border-2 border-yellow-500 rounded-lg p-4">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Current Winner</h3>
                <div className="flex items-center gap-4">
                  {contestWinner.imageUrl ? (
                    <img 
                      src={contestWinner.imageUrl} 
                      alt={contestWinner.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-purple-900 rounded-lg flex items-center justify-center text-4xl">
                      👻
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-orange-400">{contestWinner.name}</h4>
                    <p className="text-purple-300">{contestWinner.costume}</p>
                    <p className="text-sm text-yellow-400 mt-2">
                      Status: {contestWinner.winner_published ? '🟢 Published' : '🟡 Not Published'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  {!contestWinner.winner_published ? (
                    <Button
                      onClick={handlePublishWinner}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Publish Winner
                    </Button>
                  ) : (
                    <Button
                      onClick={handleUnpublishWinner}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                    >
                      Unpublish Winner
                    </Button>
                  )}
                  <Button
                    onClick={handleClearWinner}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Clear Winner
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-purple-300 text-center py-4">No contest winner set yet</p>
            )}

            {/* Set New Winner */}
            <div className="space-y-4 border-t border-orange-500/50 pt-6">
              <h3 className="text-xl text-orange-400 font-bold">Set Winner</h3>
              <div className="space-y-2">
                <Label className="text-purple-300">Select Contestant</Label>
                <select
                  value={selectedContestWinner}
                  onChange={(e) => setSelectedContestWinner(e.target.value)}
                  className="w-full bg-black border-orange-500 text-white p-2 rounded"
                >
                  <option value="">Choose winner...</option>
                  {contestants.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.costume})</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSetContestWinner(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!selectedContestWinner}
                >
                  Set Winner (Don't Publish)
                </Button>
                <Button
                  onClick={() => handleSetContestWinner(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!selectedContestWinner}
                >
                  Set & Publish Winner
                </Button>
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
};
