import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FloatingDecorations } from './components/FloatingDecorations';
import { DisplayPage } from './pages/DisplayPage';
import { VotePage } from './pages/VotePage';
import { AdminPage } from './pages/AdminPage';
import { GamesPage } from './pages/GamesPage';
import { Contestant } from './types';
import { contestantsAPI } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState<'display' | 'vote' | 'games' | 'admin'>('display');
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);

  // Load contestants from backend
  useEffect(() => {
    loadContestants();
  }, []);

  const loadContestants = async () => {
    try {
      const data = await contestantsAPI.getAll();
      setContestants(data);
    } catch (error) {
      console.error('Error loading contestants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContestant = async (contestant: Contestant, adminPassword: string) => {
    try {
      await contestantsAPI.add(contestant, adminPassword);
      await loadContestants(); // Reload from backend
    } catch (error) {
      throw error; // Let AdminPage handle the error
    }
  };

  const handleUpdateContestant = async (contestant: Contestant, adminPassword: string) => {
    try {
      await contestantsAPI.update(contestant, adminPassword);
      // Clear image cache to force reload of updated image
      try {
        localStorage.removeItem(`img_cache_${contestant.id}`);
      } catch (err) {
        console.warn('Failed to clear image cache:', err);
      }
      await loadContestants(); // Reload from backend
    } catch (error) {
      throw error; // Let AdminPage handle the error
    }
  };

  const handleDeleteContestant = async (id: string, adminPassword: string) => {
    try {
      await contestantsAPI.delete(id, adminPassword);
      // Clear image cache for deleted contestant
      try {
        localStorage.removeItem(`img_cache_${id}`);
      } catch (err) {
        console.warn('Failed to clear image cache:', err);
      }
      await loadContestants(); // Reload from backend
    } catch (error) {
      throw error; // Let AdminPage handle the error
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">👻</div>
          <h2 className="text-3xl font-bold text-orange-500">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-black via-purple-950 to-black flex flex-col">
      <FloatingDecorations />
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 relative overflow-y-auto">
        {currentPage === 'display' && (
          <DisplayPage contestants={contestants} />
        )}
        {currentPage === 'vote' && (
          <VotePage contestants={contestants} />
        )}
        {currentPage === 'games' && (
          <GamesPage />
        )}
        {currentPage === 'admin' && (
          <AdminPage 
            contestants={contestants}
            onAddContestant={handleAddContestant}
            onUpdateContestant={handleUpdateContestant}
            onDeleteContestant={handleDeleteContestant}
          />
        )}
      </main>
    </div>
  );
}

export default App;

