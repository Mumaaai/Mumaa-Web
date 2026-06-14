import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ScaleContextType {
  dpr: number;
  isCompensated: boolean;
  toggleCompensation: () => void;
}

const ScaleContext = createContext<ScaleContextType | undefined>(undefined);

export const ScaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dpr, setDpr] = useState(window.devicePixelRatio || 1);
  const [isCompensated, setIsCompensated] = useState(false);

  const updateScale = useCallback(() => {
    const currentDpr = window.devicePixelRatio || 1;
    setDpr(currentDpr);

    const isDesktop = window.innerWidth >= 768;

    if (isCompensated && currentDpr > 1 && isDesktop) {
      // Scale down font size to compensate for OS scaling on desktop
      // 16px is the base. At 1.25 DPR, we set base to 16/1.25 = 12.8px
      // This effectively makes the UI elements (defined in rem) smaller
      document.documentElement.style.fontSize = `${(16 / currentDpr)}px`;
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [isCompensated]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  // Ensure any previously saved preference is removed
  useEffect(() => {
    try {
      localStorage.removeItem('mumaa_scale_compensation');
    } catch (e) {
      // ignore (e.g., SSR or privacy settings)
    }
  }, []);

  const toggleCompensation = () => {
    setIsCompensated(prev => !prev);
  };

  return (
    <ScaleContext.Provider value={{ dpr, isCompensated, toggleCompensation }}>
      {children}
    </ScaleContext.Provider>
  );
};

export const useScale = () => {
  const context = useContext(ScaleContext);
  if (!context) throw new Error('useScale must be used within a ScaleProvider');
  return context;
};
