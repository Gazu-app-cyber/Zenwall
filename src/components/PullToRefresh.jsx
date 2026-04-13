import { RefreshCw } from "lucide-react";
import { useRef, useState } from "react";

export default function PullToRefresh({ children, onRefresh }) {
  const startY = useRef(0);
  const pulling = useRef(false);
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const threshold = 70;

  const onTouchStart = (event) => {
    if (window.scrollY > 0 || refreshing) return;
    startY.current = event.touches[0].clientY;
    pulling.current = true;
  };

  const onTouchMove = (event) => {
    if (!pulling.current) return;
    const nextDistance = Math.max(0, event.touches[0].clientY - startY.current);
    setDistance(Math.min(nextDistance, 110));
  };

  const onTouchEnd = async () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (distance >= threshold) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    setDistance(0);
  };

  return (
    <section onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="flex items-center justify-center overflow-hidden transition-all" style={{ height: distance ? Math.max(distance * 0.7, 20) : refreshing ? 52 : 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs text-muted-foreground">
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Atualizando wallpapers" : distance >= threshold ? "Solte para atualizar" : "Puxe para atualizar"}
        </div>
      </div>
      {children}
    </section>
  );
}
