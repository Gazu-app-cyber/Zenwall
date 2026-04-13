import {
  Circle,
  Grid2x2,
  Leaf,
  Moon,
  Mountain,
  Orbit,
  Palette,
  PawPrint,
  SlidersHorizontal,
  Waves,
  Building2,
} from "lucide-react";
import { useState } from "react";
import Drawer from "@/components/Drawer";
import { cn } from "@/lib/utils";

const iconMap = {
  all: Grid2x2,
  nature: Leaf,
  abstract: Palette,
  space: Orbit,
  city: Building2,
  minimal: Circle,
  ocean: Waves,
  mountains: Mountain,
  dark: Moon,
  animals: PawPrint,
};

export default function CategoryFilter({ categories, activeCategory, onSelect }) {
  const [open, setOpen] = useState(false);
  const active = categories.find((item) => item.id === activeCategory);

  return (
    <>
      <div className="hidden flex-wrap gap-2 md:flex">
        {categories.map((category) => (
          (() => {
            const Icon = iconMap[category.id] || SlidersHorizontal;
            return (
              <button
                key={category.id}
                onClick={() => onSelect(category.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm transition",
                  activeCategory === category.id
                    ? "border-primary/50 bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(124,58,237,0.32)]"
                    : "border-white/8 bg-card/70 text-muted-foreground hover:border-white/15 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            );
          })()
        ))}
      </div>
      <button onClick={() => setOpen(true)} className="flex items-center justify-between rounded-[1.6rem] border border-border/60 bg-card/70 px-4 py-3 md:hidden">
        <span className="inline-flex items-center gap-2 text-sm">
          <SlidersHorizontal className="h-4 w-4" />
          Categoria
        </span>
        <span className="text-sm text-muted-foreground">{active?.label || "Todos"}</span>
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Escolha uma categoria">
        <div className="space-y-2">
          {categories.map((category) => (
            (() => {
              const Icon = iconMap[category.id] || SlidersHorizontal;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    onSelect(category.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition",
                    activeCategory === category.id ? "bg-primary/15 text-primary" : "bg-secondary/60 text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })()
          ))}
        </div>
      </Drawer>
    </>
  );
}
