import React, { createContext, useState, useContext, useEffect } from "react";

interface DecodedToken {
  name: string;
  iat: number;
  exp: number;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  authToken: string;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
}

const base64UrlDecode = (str: string) => {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return atob(base64);
};

const decodeJwt = (token: string): DecodedToken => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT does not have 3 parts");
  }
  const payload = parts[1];
  return JSON.parse(base64UrlDecode(payload));
};

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [tokenLoaded, setTokenLoaded] = useState(false);

  const setAndStoreAuthToken = (token: string) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token); // Store token in local storage
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken") || "";
    if (token) {
      setTokenLoaded(true);
      try {
        const decodedToken = decodeJwt(token);
        const targetDate = new Date(2024, 8, 4, 13, 0, 0).getTime(); // September 4, 2024, 12 PM
        const issuedAt =
          decodedToken && decodedToken.iat ? decodedToken.iat * 1000 : 0; // Convert iat to milliseconds

        if (issuedAt < targetDate) {
          // Token is older than the target date, so log out
          clearAuthToken();
        } else {
          setAuthToken(token);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        clearAuthToken();
      }
    }
  }, [tokenLoaded]);

  const clearAuthToken = () => {
    setAuthToken("");
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        authToken,
        setAuthToken: setAndStoreAuthToken,
        clearAuthToken,
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
