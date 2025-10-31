import React, { useEffect } from 'react';
import { useSpring, animated, config } from '@react-spring/web';

const FloatingDecoration: React.FC<{ src: string; index: number; top: string; left?: string; right?: string }> = ({ 
  src, 
  index, 
  top, 
  left, 
  right 
}) => {
  const [springs, api] = useSpring(() => ({
    from: { 
      x: 0, 
      y: 0, 
      rotate: 0,
      scale: 1
    },
    config: { ...config.slow, tension: 50, friction: 15 },
  }));

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;
    const speed = 0.003 + Math.random() * 0.002; // Increased speed
    const radiusX = 100 + Math.random() * 80; // Increased radius
    const radiusY = 80 + Math.random() * 60; // Increased radius
    const rotationSpeed = 0.6 + Math.random() * 0.6;
    
    const loop = () => {
      time += 1;
      
      // Create circular/elliptical motion
      const x = Math.sin(time * speed) * radiusX;
      const y = Math.cos(time * speed * 0.9) * radiusY;
      const rotate = Math.sin(time * speed * rotationSpeed) * 40;
      
      api.start({
        x,
        y,
        rotate,
        config: { tension: 20, friction: 10 },
      });
      
      animationFrameId = requestAnimationFrame(loop);
    };

    const timeout = setTimeout(() => {
      loop();
    }, index * 200);
    
    return () => {
      clearTimeout(timeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [api, index]);

  return (
    <animated.div
      className="absolute opacity-70"
      style={{
        top,
        left,
        right,
        transform: springs.x.to((x) => `translate3d(${x}px, ${springs.y.get()}px, 0) rotate(${springs.rotate.get()}deg)`),
        willChange: 'transform',
        filter: 'drop-shadow(0 0 12px rgba(255, 107, 53, 0.5))',
      }}
    >
      <img
        src={src}
        alt="Halloween decoration"
        className="w-24 h-24 md:w-32 md:h-32"
      />
    </animated.div>
  );
};

export const FloatingDecorations: React.FC = () => {
  const decorations = [
    { src: '/svgs/pumpkin-halloween-svgrepo-com.svg', top: '10%', left: '5%' },
    { src: '/svgs/bat-svgrepo-com.svg', top: '20%', right: '10%' },
    { src: '/svgs/spider-svgrepo-com.svg', top: '40%', left: '8%' },
    { src: '/svgs/skull-svgrepo-com.svg', top: '60%', right: '5%' },
    { src: '/svgs/zombie-svgrepo-com.svg', top: '70%', left: '15%' },
    { src: '/svgs/tombstone-death-svgrepo-com.svg', top: '85%', right: '20%' },
    { src: '/svgs/broom-witch-svgrepo-com.svg', top: '15%', right: '25%' },
    { src: '/svgs/pumpkin-halloween-svgrepo-com.svg', top: '50%', right: '15%' },
    { src: '/svgs/bat-svgrepo-com.svg', top: '30%', left: '20%' },
    { src: '/svgs/spider-svgrepo-com.svg', top: '80%', left: '25%' },
    { src: '/svgs/skull-svgrepo-com.svg', top: '25%', left: '12%' },
    { src: '/svgs/zombie-svgrepo-com.svg', top: '45%', right: '18%' },
    { src: '/svgs/tombstone-death-svgrepo-com.svg', top: '55%', left: '22%' },
    { src: '/svgs/broom-witch-svgrepo-com.svg', top: '75%', right: '12%' },
    { src: '/svgs/pumpkin-halloween-svgrepo-com.svg', top: '35%', left: '3%' },
    { src: '/svgs/bat-svgrepo-com.svg', top: '65%', right: '8%' },
    { src: '/svgs/spider-svgrepo-com.svg', top: '15%', left: '18%' },
    { src: '/svgs/skull-svgrepo-com.svg', top: '90%', right: '15%' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {decorations.map((decoration, index) => (
        <FloatingDecoration
          key={index}
          src={decoration.src}
          index={index}
          top={decoration.top}
          left={decoration.left}
          right={decoration.right}
        />
      ))}
    </div>
  );
};

