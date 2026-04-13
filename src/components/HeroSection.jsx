export default function HeroSection({ totalCount }) {
  return (
    <section className="hero">
      <div className="hero__glow hero__glow--left" />
      <div className="hero__glow hero__glow--right" />
      <div className="container hero__content">
        <div className="hero__tag">100% gratuito • sem direitos autorais</div>
        <h1 className="hero__title">
          Wallpapers
          <span>Incriveis</span>
        </h1>
        <p className="hero__subtitle">
          Descubra {totalCount}+ wallpapers para desktop e mobile com download rapido e visual premium.
        </p>
        <div className="hero__meta">
          <span>Download instantaneo</span>
          <span>•</span>
          <span>HD & 4K</span>
        </div>
      </div>
    </section>
  );
}
