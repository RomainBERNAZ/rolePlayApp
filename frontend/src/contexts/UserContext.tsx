import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface UserContextProps {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  isAdmin: boolean;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const isAdmin = userRole === 'Admin';

  return (
    <UserContext.Provider value={{ userRole, setUserRole, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};