import { createContext, useContext, useState } from 'react';
import api from '../services/api';

interface AuthContextData {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string, 
    password: string,
    nationality: string,
    naturalness: string,
    cpf: string,
    gender: string,
    birthDate: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: any) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string, 
    password: string,
    nationality: string,
    naturalness: string,
    cpf: string,
    gender: string,
    birthDate: string
  ) => {
    const [day, month, year] = birthDate.split("/");

    const formattedBirthDate = new Date(`${parseInt(year)}-${parseInt(month)}-${parseInt(day)}`);

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        nationality,
        naturalness,
        cpf,
        birthDate: formattedBirthDate,
        gender
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
    } catch (error) {
      console.error('Registration failed:', error);
      
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);