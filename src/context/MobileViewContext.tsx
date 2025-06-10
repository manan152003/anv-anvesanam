import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface MobileViewContextType {
  isMobileView: boolean;
  toggleMobileView: () => void;
}

const MobileViewContext = createContext<MobileViewContextType | undefined>(undefined);

export const MobileViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMobileView, setIsMobileView] = useState(false);

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