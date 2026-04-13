import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";
import AuthModal from "@/components/AuthModal";

export default function AppLayout() {
  const { isBooting, authModalOpen, closeAuthModal } = useAuth();

  if (isBooting) {
    return (
      <div className="screen-loader">
        <div className="screen-loader__spinner" />
      </div>
    );
  }

  return (
    <>
      <div className="app-shell">
        <Outlet />
      </div>
      <BottomNav />
      <AuthModal open={authModalOpen} onClose={closeAuthModal} />
    </>
  );
}
