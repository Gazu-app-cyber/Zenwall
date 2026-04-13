import { useEffect, useRef, useState } from "react";

export default function PullToRefresh({ onRefresh, children }) {
  const startY = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const handleTouchStart = (event) => {
      if (window.scrollY === 0) {
        startY.current = event.touches[0].clientY;
      }
    };

    const handleTouchMove = (event) => {
      if (!startY.current || window.scrollY > 0 || refreshing) return;
      const currentDistance = event.touches[0].clientY - startY.current;
      if (currentDistance > 0) {
        setPullDistance(Math.min(currentDistance, 120));
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= 70 && !refreshing) {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
      }
      setPullDistance(0);
      startY.current = 0;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onRefresh, pullDistance, refreshing]);

  return (
    <>
      <div className="pull-indicator" style={{ opacity: pullDistance ? 1 : 0 }}>
        {refreshing ? "Atualizando..." : pullDistance >= 70 ? "Solte para atualizar" : "Puxe para atualizar"}
      </div>
      <div style={{ transform: `translateY(${Math.min(pullDistance, 54)}px)` }}>{children}</div>
    </>
  );
}
