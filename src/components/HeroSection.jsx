import { Sparkles, Smartphone, Wand2 } from "lucide-react";

export default function HeroSection({ totalCount, sourceLabel }) {
  return (
    <section className="overflow-hidden rounded-[2.5rem] border border-primary/20 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.3),_transparent_35%),linear-gradient(135deg,rgba(17,24,39,0.95),rgba(15,23,42,0.85))] p-6 sm:p-8">
      <div className="max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-4 w-4" />
          Wallpapers abertos
        </div>
        <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">
          Wallpapers prontos para baixar no celular, com feed infinito e experiencia mobile de verdade.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
          O app carrega novas imagens em segundo plano, permite salvar favoritos em pastas e libera uso ilimitado com premium.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
            <Smartphone className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Mobile first</p>
            <strong className="mt-1 block text-xl">{totalCount}+</strong>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
            <Wand2 className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Fonte ativa</p>
            <strong className="mt-1 block text-sm">{sourceLabel}</strong>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
            <Sparkles className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Plano free</p>
            <strong className="mt-1 block text-sm">3 saves por dia + anuncios</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
