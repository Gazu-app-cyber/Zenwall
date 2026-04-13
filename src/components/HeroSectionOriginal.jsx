import { motion } from "framer-motion";
import { Download, Sparkles } from "lucide-react";

export default function HeroSectionOriginal({ totalCount }) {
  return (
    <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-32 right-1/4 w-56 h-56 bg-purple-500/8 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-body text-primary mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Gratuito • Sem direitos autorais</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Wallpapers
            <span className="block text-primary">Incríveis</span>
          </h1>
          <p className="font-body text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-6">
            Descubra {totalCount}+ wallpapers de alta qualidade para desktop e mobile. Baixe grátis.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
              <Download className="w-4 h-4" />
              <span>Download instantâneo</span>
            </div>
            <span className="text-border">•</span>
            <div className="text-sm text-muted-foreground font-body">HD & 4K</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
