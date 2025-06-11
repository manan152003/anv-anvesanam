import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface MobileViewContextType {
  isMobileView: boolean;
  toggleMobileView: () => void;
}

const MobileViewContext = createContext<MobileViewContextType | undefined>(undefined);

export const MobileViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      // Initial check
      const checkMobile = () => {
        setIsMobileView(window.innerWidth <= 768);
      };

      // Add event listener for window resize
      window.addEventListener('resize', checkMobile);
      
      // Initial check
      checkMobile();

      // Cleanup
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const toggleMobileView = () => {
    setIsMobileView((prev) => !prev);
  };

  return (
    <MobileViewContext.Provider value={{ isMobileView, toggleMobileView }}>
      {children}
    </MobileViewContext.Provider>
  );
};

export const useMobileView = () => {
  const context = useContext(MobileViewContext);
  if (context === undefined) {
    throw new Error('useMobileView must be used within a MobileViewProvider');
  }
  return context;
}; 