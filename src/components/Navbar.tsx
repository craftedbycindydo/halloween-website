import React from 'react';
import { Button } from './ui/button';
import { Ghost, Vote, Shield } from 'lucide-react';

interface NavbarProps {
  currentPage: 'display' | 'vote' | 'admin';
  onNavigate: (page: 'display' | 'vote' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b-2 border-orange-500/50">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-2">
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onNavigate('display')}
          >
            <Ghost className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg whitespace-nowrap">
              👻 Spooky Contest 🎃
            </h1>
          </div>
          
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant={currentPage === 'display' ? 'default' : 'outline'}
              onClick={() => onNavigate('display')}
              className={currentPage === 'display' 
                ? "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-400 text-xs sm:text-base px-3 sm:px-6 py-2 font-semibold shadow-lg" 
                : "bg-white hover:bg-gray-100 text-purple-900 border-2 border-white text-xs sm:text-base px-3 sm:px-6 py-2 font-semibold"}
            >
              <Ghost className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Display</span>
              <span className="sm:hidden">Display</span>
            </Button>
            <Button
              variant={currentPage === 'vote' ? 'default' : 'outline'}
              onClick={() => onNavigate('vote')}
              className={currentPage === 'vote' 
                ? "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-400 text-xs sm:text-base px-3 sm:px-6 py-2 font-semibold shadow-lg" 
                : "bg-white hover:bg-gray-100 text-purple-900 border-2 border-white text-xs sm:text-base px-3 sm:px-6 py-2 font-semibold"}
            >
              <Vote className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Vote</span>
              <span className="sm:hidden">Vote</span>
            </Button>
            <Button
              variant={currentPage === 'admin' ? 'default' : 'outline'}
              onClick={() => onNavigate('admin')}
              className={currentPage === 'admin' 
                ? "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-400 text-xs sm:text-base px-3 sm:px-6 py-2 font-semibold shadow-lg" 
                : "bg-white hover:bg-gray-100 text-purple-900 border-2 border-white text-xs sm:text-base px-3 sm:px-6 py-2 font-semibold"}
            >
              <Shield className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Admin</span>
              <span className="sm:hidden">Admin</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

