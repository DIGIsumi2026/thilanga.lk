import React, { createContext, useContext, useState, ReactNode } from 'react';

type PageLoadContextValue = {
  isPageReady: boolean;
  isLoaderComplete: boolean;
  setPageReady: (ready: boolean) => void;
  setLoaderComplete: (complete: boolean) => void;
};

const PageLoadContext = createContext<PageLoadContextValue | undefined>(undefined);

export function PageLoadProvider({ children }: { children: ReactNode }) {
  const [isPageReady, setPageReady] = useState(false);
  const [isLoaderComplete, setLoaderComplete] = useState(false);

  return (
    <PageLoadContext.Provider
      value={{
        isPageReady,
        isLoaderComplete,
        setPageReady,
        setLoaderComplete,
      }}
    >
      {children}
    </PageLoadContext.Provider>
  );
}

export function usePageLoad() {
  const context = useContext(PageLoadContext);
  if (!context) {
    throw new Error('usePageLoad must be used within a PageLoadProvider');
  }
  return context;
}
