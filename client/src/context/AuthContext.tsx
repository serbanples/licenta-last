import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { whoami } from '@/services/auth';
import { AuthContextType } from './types';
import { UserContext, UserState } from '@/services/types';
import { useLoading } from '@/hooks';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<UserState | undefined>({ loggedIn: null, user: null });
  const { setLoading } = useLoading();

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['whoami'],
    queryFn: whoami,
    retry: false,
  });

  // Manage global loading
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Update auth state when query resolves
  useEffect(() => {
    if (data) {
      setState({ loggedIn: true, user: data });
    } else if (isError) {
      console.warn(error);
      setState({ loggedIn: false, user: null });
    }
  }, [data, isError, error]);

  const refreshUserContext = () => {
    refetch();
  };

  const setUserContext = (user: UserContext) => {
    setState({ loggedIn: true, user });
  };

  const getUserContext = () => state;

  const deleteUserContext = () => {
    setState({ loggedIn: false, user: null });
  };

  return (
    <AuthContext.Provider
      value={{ setUser: setUserContext, getUser: getUserContext, deleteUser: deleteUserContext, refreshUser: refreshUserContext }}
    >
      {children}
    </AuthContext.Provider>
  );
};
