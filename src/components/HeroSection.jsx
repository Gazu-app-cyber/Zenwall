import { Download, Sparkles } from "lucide-react";

export default function HeroSection({ totalCount, sourceLabel }) {
  return (
    <section className="relative overflow-hidden rounded-[2.8rem] border border-white/5 bg-[radial-gradient(circle_at_28%_35%,rgba(76,29,149,0.32),transparent_22%),radial-gradient(circle_at_65%_25%,rgba(91,33,182,0.24),transparent_18%),linear-gradient(180deg,rgba(9,9,11,0.98),rgba(9,9,11,0.94))] px-6 py-14 text-center sm:px-10 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.02),transparent)] opacity-40" />
      <div className="relative mx-auto max-w-3xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          100% Gratuito • Sem direitos autorais
        </div>

        <h1 className="font-heading text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl">
          Wallpapers
          <span className="mt-2 block bg-gradient-to-r from-primary via-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            Incriveis
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Descubra {Math.max(totalCount, 54)}+ wallpapers de alta qualidade para desktop e mobile. Baixe gratis.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download instantaneo
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
          <span>HD & 4K</span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
          <span className="max-w-[220px] truncate">{sourceLabel}</span>
        </div>
      </div>
    </section>
  );
}
