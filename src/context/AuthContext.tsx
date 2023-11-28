import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  authToken: string;
  setAuthToken: (token: string) => void;
  clearAuthToken:() => void
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); //FIXME: Make it false
  const [authToken, setAuthToken] = useState("");
  const setAndStoreAuthToken = (token: string) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token); // Store token in local storage
    setIsAuthenticated(true);
  };
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);
  

  const clearAuthToken = () => {
    setAuthToken('');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        authToken,
        setAuthToken: setAndStoreAuthToken,
        clearAuthToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
