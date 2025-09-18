'use client';

import { motion } from 'framer-motion';
import CustomLogo from './CustomLogo';

interface AppHeaderProps {
  className?: string;
}

export default function AppHeader({ className = '' }: AppHeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`flex items-center justify-between p-6 ${className}`}
    >
      <div className="flex items-center gap-4">
        <CustomLogo size="sm" animate={false} />
        <div>
          <h1 className="text-xl font-bold text-gray-900">3D Generator</h1>
          <p className="text-sm text-gray-600">AI-Powered Creation</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Ready to generate</span>
      </div>
    </motion.header>
  );
}
