import React from 'react';
import { Button } from './ui/button';
import { Ghost, Vote, Shield, Trophy } from 'lucide-react';

interface NavbarProps {
  currentPage: 'display' | 'vote' | 'games' | 'admin';
  onNavigate: (page: 'display' | 'vote' | 'games' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="flex-shrink-0 z-50 bg-black/30 backdrop-blur-md border-b-2 border-orange-500/50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div 
            className="flex items-center gap-1 sm:gap-2 md:gap-3 cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
            onClick={() => onNavigate('display')}
          >
            <h1 className="text-sm sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-lg">
              <span className="hidden xs:inline">👻 Spooky Contest 🎃</span>
              <span className="xs:hidden">👻 Spooky Contest 🎃</span>
            </h1>
          </div>
          
          <div className="flex gap-1 sm:gap-2 md:gap-3">
            <Button
              variant={currentPage === 'display' ? 'default' : 'outline'}
              onClick={() => onNavigate('display')}
              size="sm"
              className={currentPage === 'display' 
                ? "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-400 text-[10px] xs:text-xs sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 md:px-6 py-1 xs:py-1.5 sm:py-2 font-semibold shadow-lg h-7 xs:h-8 sm:h-9 md:h-10" 
                : "bg-white hover:bg-gray-100 text-purple-900 border-2 border-white text-[10px] xs:text-xs sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 md:px-6 py-1 xs:py-1.5 sm:py-2 font-semibold h-7 xs:h-8 sm:h-9 md:h-10"}
            >
              <Ghost className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 xs:mr-1 sm:mr-1.5 md:mr-2" />
              <span>Display</span>
            </Button>
            <Button
              variant={currentPage === 'vote' ? 'default' : 'outline'}
              onClick={() => onNavigate('vote')}
              size="sm"
              className={currentPage === 'vote' 
                ? "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-400 text-[10px] xs:text-xs sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 md:px-6 py-1 xs:py-1.5 sm:py-2 font-semibold shadow-lg h-7 xs:h-8 sm:h-9 md:h-10" 
                : "bg-white hover:bg-gray-100 text-purple-900 border-2 border-white text-[10px] xs:text-xs sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 md:px-6 py-1 xs:py-1.5 sm:py-2 font-semibold h-7 xs:h-8 sm:h-9 md:h-10"}
            >
              <Vote className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 xs:mr-1 sm:mr-1.5 md:mr-2" />
              <span>Vote</span>
            </Button>
            <Button
              variant={currentPage === 'games' ? 'default' : 'outline'}
              onClick={() => onNavigate('games')}
              size="sm"
              className={currentPage === 'games' 
                ? "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-400 text-[10px] xs:text-xs sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 md:px-6 py-1 xs:py-1.5 sm:py-2 font-semibold shadow-lg h-7 xs:h-8 sm:h-9 md:h-10" 
                : "bg-white hover:bg-gray-100 text-purple-900 border-2 border-white text-[10px] xs:text-xs sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 md:px-6 py-1 xs:py-1.5 sm:py-2 font-semibold h-7 xs:h-8 sm:h-9 md:h-10"}
            >
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 xs:mr-1 sm:mr-1.5 md:mr-2" />
              <span>Games</span>
            </Button>
            <Button
              variant={currentPage === 'admin' ? 'default' : 'outline'}
              onClick={() => onNavigate('admin')}
              size="sm"
              className={currentPage === 'admin' 
                ? "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-400 text-[10px] xs:text-xs sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 md:px-6 py-1 xs:py-1.5 sm:py-2 font-semibold shadow-lg h-7 xs:h-8 sm:h-9 md:h-10" 
                : "bg-white hover:bg-gray-100 text-purple-900 border-2 border-white text-[10px] xs:text-xs sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 md:px-6 py-1 xs:py-1.5 sm:py-2 font-semibold h-7 xs:h-8 sm:h-9 md:h-10"}
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 xs:mr-1 sm:mr-1.5 md:mr-2" />
              <span>Admin</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

