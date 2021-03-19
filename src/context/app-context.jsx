import React from 'react';

const AppContext = React.createContext();

const initialValue = {
  isRepoNavDisabled: false,
  isAccSyncing: null,
};

const AppContextProvider = ({ children }) => {
  const contextValue = React.useState(initialValue);
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
