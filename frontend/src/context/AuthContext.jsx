import { createContext, useState } from 'react';

export const AuthContext = createContext();

/**
 * Provides authentication state and session handlers.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  /**
   * Log in user and cache session credentials.
   * @param {Object} data - Authenticated user session data
   * @param {string} data.token - Access JWT token
   * @param {Object} data.user - User details
   */
  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  /**
   * Log out user and destroy cached credentials.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
