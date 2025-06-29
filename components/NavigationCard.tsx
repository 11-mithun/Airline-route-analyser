import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface NavigationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  className?: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ 
  icon, 
  title, 
  description, 
  path,
  className 
}) => {
  const [, setLocation] = useLocation();

  return (
    <motion.div
      className={cn(
        "bg-gradient-to-br from-midnight-light to-midnight-dark backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-opacity-20 border-forest cursor-pointer",
        className
      )}
      whileHover={{ y: -8, boxShadow: '0 10px 25px -5px rgba(76, 175, 80, 0.4)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => setLocation(path)}
    >
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-forest bg-opacity-20 text-forest">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
      <motion.div 
        className="mt-4 h-1 w-1/3 bg-forest mx-auto rounded-full"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default NavigationCard;
