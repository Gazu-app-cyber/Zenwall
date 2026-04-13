import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import Drawer from "@/components/Drawer";
import { cn } from "@/lib/utils";

export default function CategoryFilter({ categories, activeCategory, onSelect }) {
  const [open, setOpen] = useState(false);
  const active = categories.find((item) => item.id === activeCategory);

  return (
    <>
      <div className="hidden flex-wrap gap-2 md:flex">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              activeCategory === category.id ? "border-primary/40 bg-primary/15 text-primary" : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground"
            )}
          >
            {category.label}
          </button>
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
            <button
              key={category.id}
              onClick={() => {
                onSelect(category.id);
                setOpen(false);
              }}
              className={cn(
                "w-full rounded-2xl px-4 py-3 text-left text-sm transition",
                activeCategory === category.id ? "bg-primary/15 text-primary" : "bg-secondary/60 text-muted-foreground"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </Drawer>
    </>
  );
}
