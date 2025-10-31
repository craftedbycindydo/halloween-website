import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Trophy, Award, Gamepad2 } from 'lucide-react';
import { gamesAPI } from '../services/api';

export const GamesPage: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const [overallLeaderboard, setOverallLeaderboard] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [gameWinners, setGameWinners] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'overall' | 'byGame'>('overall');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Refresh every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [gamesData, leaderboardData] = await Promise.all([
        gamesAPI.getAll(),
        gamesAPI.getLeaderboard()
      ]);
      setGames(gamesData);
      setOverallLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading games data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowGameWinners = async (game: any) => {
    try {
      const winners = await gamesAPI.getGameWinners(game.id);
      setGameWinners(winners);
      setSelectedGame(game);
      setViewMode('byGame');
    } catch (error) {
      console.error('Error loading game winners:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">🎃</div>
          <h2 className="text-3xl font-bold text-orange-500">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-2 flex items-center justify-center gap-3">
            <Gamepad2 className="w-10 h-10" />
            Games Leaderboard
            <Trophy className="w-10 h-10" />
          </h1>
          <p className="text-purple-300">Track winners across all Halloween games!</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 justify-center flex-wrap">
          <Button
            onClick={() => setViewMode('overall')}
            variant={viewMode === 'overall' ? 'default' : 'outline'}
            className={viewMode === 'overall' 
              ? 'bg-blue-600 hover:bg-blue-700 border-2 border-blue-400' 
              : 'bg-white hover:bg-gray-100 text-purple-900 border-2 border-white'
            }
          >
            <Award className="w-5 h-5 mr-2" />
            Overall Leaderboard
          </Button>
          <Button
            onClick={() => setViewMode('byGame')}
            variant={viewMode === 'byGame' ? 'default' : 'outline'}
            className={viewMode === 'byGame' 
              ? 'bg-blue-600 hover:bg-blue-700 border-2 border-blue-400' 
              : 'bg-white hover:bg-gray-100 text-purple-900 border-2 border-white'
            }
          >
            <Gamepad2 className="w-5 h-5 mr-2" />
            By Game
          </Button>
        </div>

        {viewMode === 'overall' ? (
          // Overall Leaderboard
          <Card className="bg-black/90 border-orange-500 border-2 shadow-2xl shadow-orange-900/50">
            <CardHeader>
              <CardTitle className="text-3xl text-orange-500 flex items-center gap-2">
                <Trophy className="w-8 h-8" />
                Overall Champions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overallLeaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👻</div>
                  <p className="text-purple-300 text-xl">No game winners yet!</p>
                  <p className="text-purple-400 text-sm mt-2">Check back after games are played</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {overallLeaderboard.map((contestant, index) => (
                    <div 
                      key={contestant.id}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-transform hover:scale-105 ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-2 border-yellow-500' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400/30 to-gray-600/30 border-2 border-gray-400' :
                        index === 2 ? 'bg-gradient-to-r from-orange-700/30 to-orange-900/30 border-2 border-orange-700' :
                        'bg-purple-950/50 border border-purple-500/50'
                      }`}
                    >
                      <div className="text-4xl font-bold text-orange-500 w-12 text-center">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      {contestant.imageUrl ? (
                        <img 
                          src={contestant.imageUrl} 
                          alt={contestant.name}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-orange-500"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-purple-900 rounded-lg flex items-center justify-center text-4xl border-2 border-orange-500">
                          👻
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-orange-400">{contestant.name}</h3>
                        <p className="text-purple-300">{contestant.costume}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-blue-500">{contestant.total_wins}</div>
                        <div className="text-sm text-purple-400">
                          {contestant.total_wins === 1 ? 'WIN' : 'WINS'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          // By Game View
          <div className="space-y-6">
            <Card className="bg-black/90 border-orange-500 border-2 shadow-2xl shadow-orange-900/50">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-500">Select Game</CardTitle>
              </CardHeader>
              <CardContent>
                {games.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-purple-300">No games created yet!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-purple-300">Choose a game to view winners</Label>
                    <select 
                      value={selectedGame?.id || ''}
                      onChange={(e) => {
                        const game = games.find(g => g.id === parseInt(e.target.value));
                        if (game) handleShowGameWinners(game);
                      }}
                      className="w-full bg-black border-orange-500 text-white p-3 rounded-lg text-lg"
                    >
                      <option value="">Choose a game...</option>
                      {games.map(game => (
                        <option key={game.id} value={game.id}>
                          {game.name} ({game.winner_count || 0} {game.winner_count === 1 ? 'winner' : 'winners'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedGame && (
              <Card className="bg-black/90 border-orange-500 border-2 shadow-2xl shadow-orange-900/50">
                <CardHeader>
                  <CardTitle className="text-3xl text-orange-500 flex items-center gap-2">
                    <Gamepad2 className="w-8 h-8" />
                    {selectedGame.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {gameWinners.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎃</div>
                      <p className="text-purple-300 text-xl">No winners for this game yet!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {gameWinners.map((winner, index) => (
                        <div 
                          key={winner.id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-purple-950/50 border border-purple-500/50 hover:border-orange-500 transition-all"
                        >
                          <div className="text-3xl font-bold text-orange-500 w-10 text-center">
                            #{index + 1}
                          </div>
                          {winner.imageUrl ? (
                            <img 
                              src={winner.imageUrl} 
                              alt={winner.name}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-orange-500"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-purple-900 rounded-lg flex items-center justify-center text-3xl border-2 border-orange-500">
                              👻
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-orange-400">{winner.name}</h3>
                            <p className="text-purple-300">{winner.costume}</p>
                          </div>
                          <div className="text-3xl">
                            🏆
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

