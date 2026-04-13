import { Grid3X3, Trees, Sparkles, Rocket, Building2, Circle, Waves, Mountain, Moon, Cat } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const iconMap = {
  Grid3X3, Trees, Sparkles, Rocket, Building2, Circle, Waves, Mountain, Moon, Cat
};

export default function CategoryFilterOriginal({ categories, activeCategory, onSelect }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon];
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body whitespace-nowrap transition-all border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {cat.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
