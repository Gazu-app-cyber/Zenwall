import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AuthModal from "@/components/AuthModal";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setUser(base44.auth.getCurrentUser());
    setIsLoadingAuth(false);
  }, []);

  const refreshUser = () => {
    setUser(base44.auth.getCurrentUser());
  };

  const login = ({ email, password }) => {
    const nextUser = base44.auth.login({ email, password });
    setUser(nextUser);
    setShowAuthModal(false);
    toast.success("Sessao iniciada");
    return nextUser;
  };

  const signup = ({ email, password, full_name }) => {
    const nextUser = base44.auth.signup({ email, password, full_name });
    setUser(nextUser);
    setShowAuthModal(false);
    toast.success("Conta criada");
    return nextUser;
  };

  const logout = () => {
    base44.auth.logout("/");
  };

  const deleteAccount = () => {
    if (!user) return;
    const folders = base44.entities.Folder.filter({ user_email: user.email });
    const saved = base44.entities.SavedWallpaper.filter({ user_email: user.email });
    saved.forEach((item) => base44.entities.SavedWallpaper.delete(item.id));
    folders.forEach((item) => base44.entities.Folder.delete(item.id));
    base44.entities.User.delete(user.id);
    base44.auth.logout("/");
  };

  const value = useMemo(
    () => ({
      user,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError: null,
      openAuthModal: () => setShowAuthModal(true),
      closeAuthModal: () => setShowAuthModal(false),
      navigateToLogin: () => setShowAuthModal(true),
      refreshUser,
      login,
      signup,
      logout,
      deleteAccount,
    }),
    [isLoadingAuth, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={login}
        onSignup={signup}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
