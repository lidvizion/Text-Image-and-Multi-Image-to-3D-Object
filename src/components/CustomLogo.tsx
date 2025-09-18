'use client';

import { motion } from 'framer-motion';

interface CustomLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

export default function CustomLogo({ size = 'md', className = '', animate = true }: CustomLogoProps) {
  const LogoComponent = animate ? motion.svg : 'svg';
  
  const animationProps = animate ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  } : {};

  return (
    <LogoComponent
      {...animationProps}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} ${className}`}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background rounded rectangle */}
      <rect 
        x="10" 
        y="10" 
        width="80" 
        height="80" 
        rx="20" 
        ry="20" 
        fill="url(#bgGradient)"
        filter="url(#glow)"
      />
      
      {/* Main star shape */}
      <motion.path
        d="M50 25 L55 40 L70 40 L58 50 L63 65 L50 55 L37 65 L42 50 L30 40 L45 40 Z"
        fill="url(#starGradient)"
        initial={animate ? { scale: 0 } : {}}
        animate={animate ? { scale: 1 } : {}}
        transition={animate ? { delay: 0.2, duration: 0.3, ease: "easeOut" } : {}}
      />
      
      {/* Small sparkle - top right */}
      <motion.circle
        cx="70"
        cy="30"
        r="2"
        fill="white"
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={animate ? { delay: 0.4, duration: 0.2 } : {}}
      />
      
      {/* Small sparkle - bottom left */}
      <motion.circle
        cx="30"
        cy="70"
        r="1.5"
        fill="white"
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={animate ? { delay: 0.5, duration: 0.2 } : {}}
      />
      
      {/* Plus sign - top left */}
      <motion.g
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={animate ? { delay: 0.3, duration: 0.2 } : {}}
      >
        <rect x="28" y="25" width="1.5" height="8" fill="white" rx="0.75" />
        <rect x="24.75" y="28.25" width="8" height="1.5" fill="white" rx="0.75" />
      </motion.g>
      
      {/* Plus sign - bottom right */}
      <motion.g
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={animate ? { delay: 0.6, duration: 0.2 } : {}}
      >
        <rect x="70" y="67" width="1.2" height="6" fill="white" rx="0.6" />
        <rect x="67.4" y="69.4" width="6" height="1.2" fill="white" rx="0.6" />
      </motion.g>
    </LogoComponent>
  );
}
