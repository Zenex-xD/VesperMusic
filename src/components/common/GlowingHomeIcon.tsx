import React from 'react';
import { NavSquircleIcon } from './NavSquircleIcon';

interface GlowingHomeIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isGlowing?: boolean;
}

export const GlowingHomeIcon: React.FC<GlowingHomeIconProps> = ({
  size = 'md',
  className = '',
}) => {
  return <NavSquircleIcon type="home" size={size} className={className} />;
};
