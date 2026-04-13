import { createContext, useEffect, useMemo, useState } from "react";
import {
  createUserAccount,
  deleteUserAccount,
  findCurrentUser,
  loginUserAccount,
  logoutUserAccount,
} from "@/services/storage/authStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBooting, setIsBooting] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    setUser(findCurrentUser());
    setIsBooting(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isBooting,
      authModalOpen,
      openAuthModal: () => setAuthModalOpen(true),
      closeAuthModal: () => setAuthModalOpen(false),
      login: (payload) => {
        const nextUser = loginUserAccount(payload);
        setUser(nextUser);
        setAuthModalOpen(false);
        return nextUser;
      },
      signup: (payload) => {
        const nextUser = createUserAccount(payload);
        setUser(nextUser);
        setAuthModalOpen(false);
        return nextUser;
      },
      logout: () => {
        logoutUserAccount();
        setUser(null);
      },
      deleteAccount: () => {
        if (!user) return;
        deleteUserAccount(user.id, user.email);
        setUser(null);
      },
      refreshUser: () => {
        setUser(findCurrentUser());
      },
    }),
    [authModalOpen, isBooting, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
