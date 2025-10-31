import React, { useEffect, useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { ContestantCard } from '../components/ContestantCard';
import { Contestant } from '../types';
import { contestAPI } from '../services/api';

interface DisplayPageProps {
  contestants: Contestant[];
}

interface CardPosition {
  x: number;
  y: number;
}

const AnimatedCard: React.FC<{ contestant: Contestant; position: CardPosition; index: number }> = ({ 
  contestant, 
  position, 
  index 
}) => {
  const [springs, api] = useSpring(() => ({
    from: { x: 0, y: 0, rotate: 0, scale: 1 },
    config: { ...config.slow, tension: 60, friction: 20 },
  }));

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;
    const speed = 0.002 + Math.random() * 0.001; // Increased speed
    const radiusX = 80 + Math.random() * 60; // Much larger radius for free movement
    const radiusY = 60 + Math.random() * 50; // Much larger radius for free movement
    const rotationSpeed = 0.5 + Math.random() * 0.5;
    
    const loop = () => {
      time += 1;
      
      // Create smooth figure-8 or circular motion
      const x = Math.sin(time * speed) * radiusX;
      const y = Math.cos(time * speed * 1.3) * radiusY;
      const rotate = Math.sin(time * speed * rotationSpeed) * 12;
      
      api.start({
        x,
        y,
        rotate,
        config: { tension: 30, friction: 15 },
      });
      
      animationFrameId = requestAnimationFrame(loop);
    };

    const timeout = setTimeout(() => {
      loop();
    }, index * 300);
    
    return () => {
      clearTimeout(timeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [api, index]);

  return (
    <animated.div
      className="absolute z-10"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '180px',
        transform: springs.x.to(x => 
          `translate3d(${x}px, ${springs.y.get()}px, 0) rotate(${springs.rotate.get()}deg)`
        ),
        willChange: 'transform',
      }}
    >
      <ContestantCard contestant={contestant} />
    </animated.div>
  );
};

export const DisplayPage: React.FC<DisplayPageProps> = ({ contestants }) => {
  const [cardPositions, setCardPositions] = useState<CardPosition[]>([]);
  const [contestWinner, setContestWinner] = useState<any>(null);
  const [displayContestants, setDisplayContestants] = useState<Contestant[]>(contestants);

  // Check for published contest winner
  useEffect(() => {
    const checkWinner = async () => {
      try {
        const winner = await contestAPI.getWinner();
        if (winner && winner.winner_published && winner.winner_id) {
          setContestWinner(winner);
          // Only show the winner
          const winnerContestant = contestants.find(c => c.id === winner.winner_id);
          if (winnerContestant) {
            setDisplayContestants([winnerContestant]);
          }
        } else {
          setContestWinner(null);
          setDisplayContestants(contestants);
        }
      } catch (error) {
        console.error('Error checking contest winner:', error);
        setDisplayContestants(contestants);
      }
    };

    checkWinner();
    // Poll for winner changes every 5 seconds
    const interval = setInterval(checkWinner, 5000);
    return () => clearInterval(interval);
  }, [contestants]);

  useEffect(() => {
    const calculatePositions = () => {
      const positions: CardPosition[] = [];
      const cardWidth = 200;
      const cardHeight = 260;
      const padding = 50;
      const navbarHeight = 80; // Account for navbar
      const containerHeight = window.innerHeight - navbarHeight; // Actual container height
      
      const availableWidth = window.innerWidth - cardWidth - padding * 2;
      const availableHeight = containerHeight - cardHeight - padding * 2;
      
      // If contest winner is published, center the card
      if (contestWinner && contestWinner.winner_published && displayContestants.length === 1) {
        const x = (window.innerWidth - cardWidth) / 2;
        const y = (containerHeight - cardHeight) / 2;
        positions.push({ x, y });
      } else {
        // Spread cards randomly across the available space
        displayContestants.forEach(() => {
          const x = padding + Math.random() * availableWidth;
          const y = padding + Math.random() * availableHeight;
          
          positions.push({ x, y });
        });
      }

      setCardPositions(positions);
    };

    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    return () => window.removeEventListener('resize', calculatePositions);
  }, [displayContestants, contestWinner]);

  if (displayContestants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-full">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">👻</div>
          <h2 className="text-3xl font-bold text-orange-500 mb-2">No contestants yet!</h2>
          <p className="text-orange-300">Check back soon for spooky contestants!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-full overflow-hidden">
      {contestWinner && contestWinner.winner_published && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 text-black px-8 py-4 rounded-full shadow-2xl shadow-orange-500/50 animate-bounce">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">👑</span>
              <span>CONTEST WINNER!</span>
              <span className="text-3xl sm:text-4xl">👑</span>
            </h2>
          </div>
        </div>
      )}
      {displayContestants.map((contestant, index) => {
        const position = cardPositions[index];
        if (!position) return null;

        return (
          <AnimatedCard
            key={contestant.id}
            contestant={contestant}
            position={position}
            index={index}
          />
        );
      })}
    </div>
  );
};

