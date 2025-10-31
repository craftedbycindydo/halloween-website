import React, { useState } from 'react';
import { Contestant, Vote } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, Plus, Eye, EyeOff, Trash2, Trophy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { votesAPI } from '../services/api';

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
  const [adminPassword, setAdminPassword] = useState(''); // Store authenticated password
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  
  // Add contestant form
  const [name, setName] = useState('');
  const [costume, setCostume] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Results dialog
  const [showResults, setShowResults] = useState(false);

  // Check for existing session on mount
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const storedPassword = localStorage.getItem('halloween_admin_session');
        if (storedPassword) {
          const decrypted = atob(storedPassword);
          // Verify password is still valid
          await votesAPI.getAll(decrypted);
          setAdminPassword(decrypted);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Session invalid, clear it
        localStorage.removeItem('halloween_admin_session');
      } finally {
        setIsValidating(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify password with API by attempting to fetch votes
    try {
      await votesAPI.getAll(password);
      // If successful, store the password and authenticate
      setAdminPassword(password);
      setIsAuthenticated(true);
      // Store encrypted password in localStorage for session persistence
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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddContestant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !costume.trim()) {
      setError('Name and costume are required!');
      return;
    }

    const newContestant: Contestant = {
      id: Date.now().toString(),
      name: name.trim(),
      costume: costume.trim(),
      imageUrl: imagePreview, // Store base64 image
    };

    try {
      await onAddContestant(newContestant, adminPassword);
      setName('');
      setCostume('');
      setImagePreview('');
      setError('');
      
      // Clear file input
      const fileInput = document.getElementById('imageFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      setError(error.message || 'Failed to add contestant');
    }
  };

  const handleShowResults = async () => {
    try {
      const allVotes = await votesAPI.getAll(adminPassword);
        // Convert backend format to frontend format
        const formattedVotes: Vote[] = allVotes.map((v: any) => ({
          contestantId: v.contestantId,
          voterName: v.voterName,
          deviceId: v.deviceId,
          timestamp: v.timestamp,
          hasChanged: v.hasChanged
        }));
        setVotes(formattedVotes);
        setShowResults(true);
      } catch (error: any) {
        setError('Failed to load votes: ' + error.message);
      }
  };

  // Calculate vote counts
  const getVoteCount = (contestantId: string) => {
    return votes.filter(v => v.contestantId === contestantId).length;
  };

  const leaderboard = contestants
    .map(c => ({
      ...c,
      voteCount: getVoteCount(c.id),
    }))
    .sort((a, b) => b.voteCount - a.voteCount);

  // Show loading while validating session
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">👻</div>
          <h2 className="text-3xl font-bold text-orange-500">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md bg-black/95 border-orange-500 border-2 shadow-2xl shadow-orange-900/50">
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
        <div className="flex justify-between items-center">
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
                  className="bg-black border-orange-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-2 relative">
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
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
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

        {/* View Results */}
        <Card className="bg-black/90 border-orange-500 border-2 shadow-2xl shadow-orange-900/50">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-500 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              View Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleShowResults} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Show Leaderboard
            </Button>
          </CardContent>
        </Card>

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

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="bg-black border-orange-500 max-w-2xl shadow-2xl shadow-orange-900/50">
          <DialogHeader>
            <DialogTitle className="text-3xl text-orange-500 flex items-center gap-2">
              <Trophy className="w-8 h-8" />
              Leaderboard
            </DialogTitle>
            <DialogDescription className="text-purple-200">
              Total Votes: {votes.length}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
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
    </div>
  );
};

