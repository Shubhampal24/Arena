import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const STATS = [
  { value: '50K+',   label: 'Registered Gamers',    icon: '🎮' },
  { value: '800+',   label: 'Active Opportunities',  icon: '💼' },
  { value: '200+',   label: 'Esports Orgs',          icon: '🏢' },
  { value: '₹2Cr+',  label: 'Paid Out in Prizes',    icon: '🏆' },
];

const FEATURES = [
  {
    icon: '🎯',
    title: 'Pro Gaming Profiles',
    desc: 'Showcase your rank, stats, highlight clips, and achievements across BGMI, Valorant, Free Fire, CODM, and 20+ games.',
    color: 'var(--saffron)',
  },
  {
    icon: '💼',
    title: 'Esports Job Board',
    desc: 'Find roles as IGL, Assaulter, Caster, GFX Artist, Video Editor, Bootcamp Manager — built specifically for India\'s gaming industry.',
    color: 'var(--electric)',
  },
  {
    icon: '🏢',
    title: 'Organization Hub',
    desc: 'S8UL, GodLike, Global Esports — orgs post vacancies, manage rosters, and recruit talent with full application pipelines.',
    color: 'var(--purple-light)',
  },
  {
    icon: '📣',
    title: 'Community Feed',
    desc: 'Share achievements, highlight clips, tournament wins, and connect with India\'s gaming community — like LinkedIn for gamers.',
    color: 'var(--india-green)',
  },
  {
    icon: '🔍',
    title: 'Talent Discovery',
    desc: 'Filter by game, rank tier, device, state, and role. Orgs find the right player; players get found by the right org.',
    color: 'var(--saffron)',
  },
  {
    icon: '📊',
    title: 'Profile Score',
    desc: 'A smart completion bar tracks your profile strength — more details means more visibility to organizations and scouts.',
    color: 'var(--electric)',
  },
];

const TOP_GAMES = [
  { name: 'BGMI',          emoji: '🔫', color: '#FF6B00', platform: 'Mobile' },
  { name: 'Valorant',      emoji: '🎯', color: '#FF4655', platform: 'PC' },
  { name: 'Free Fire MAX', emoji: '💥', color: '#FFCC00', platform: 'Mobile' },
  { name: 'CODM',          emoji: '🪖', color: '#4FC3F7', platform: 'Mobile / PC' },
  { name: 'Pokémon UNITE', emoji: '⚡', color: '#FFEB3B', platform: 'Mobile / Switch' },
  { name: 'Chess',         emoji: '♟️', color: '#A5D6A7', platform: 'Multi' },
  { name: 'eFootball',     emoji: '⚽', color: '#81C784', platform: 'Multi' },
  { name: 'Minecraft',     emoji: '⛏️', color: '#8D6E63', platform: 'Multi' },
];

export default function Landing() {
  const particlesRef = useRef(null);

  useEffect(() => {
    document.title = 'ArenaX — India\'s Gaming Career Platform';
  }, []);

  return (
    <div style={{ background: 'var(--bg-void)', overflowX: 'hidden' }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(255,107,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {/* Radial glows */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '5%',  width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',   zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 100, paddingBottom: 80 }}>

          {/* India badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.3)', borderRadius: 100, marginBottom: 32 }}>
            <span style={{ fontSize: 16 }}>🇮🇳</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--saffron)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              Made for India's Gaming Community
            </span>
          </div>

          <h1 style={{ maxWidth: 800, lineHeight: 1.1, marginBottom: 24 }}>
            <span style={{ color: 'var(--text-white)' }}>Where India's</span><br />
            <span style={{ background: 'linear-gradient(135deg, var(--saffron), var(--saffron-light), #FFB347)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Gaming Careers
            </span><br />
            <span style={{ color: 'var(--text-white)' }}>Begin.</span>
          </h1>

          <p style={{ maxWidth: 600, fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: 48, lineHeight: 1.7 }}>
            The LinkedIn of Indian Esports. Connect gamers, content creators, video editors, casters, and organizations — all in one platform built for India's ₹11,000 Crore gaming industry.
          </p>

          <div className="flex gap-4" style={{ flexWrap: 'wrap', marginBottom: 64 }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              🎮 Join as Gamer
            </Link>
            <Link to="/register/org" className="btn btn-secondary btn-lg">
              🏢 Register Organization
            </Link>
            <Link to="/jobs" className="btn btn-ghost btn-lg">
              Browse Opportunities →
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 800 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '20px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-dim)', borderRadius: 12 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--saffron)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAMES TICKER ─────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-dim)', borderBottom: '1px solid var(--border-dim)', padding: '16px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 40, animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[...TOP_GAMES, ...TOP_GAMES].map((g, i) => (
            <div key={i} className="flex gap-2" style={{ alignItems: 'center', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 20 }}>{g.emoji}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: g.color, fontSize: '0.9rem' }}>{g.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({g.platform})</span>
            </div>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      {/* ── TWO PATHS SECTION ────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2>Two Paths. One Platform.</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
              Whether you're an individual gamer or a gaming organization, ArenaX is built for you.
            </p>
          </div>

          <div className="grid-2" style={{ maxWidth: 960, margin: '0 auto' }}>
            {/* User card */}
            <div className="card card-glow" style={{ padding: 40, border: '1px solid rgba(255,107,0,0.2)' }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>🎮</div>
              <h3 style={{ color: 'var(--saffron)', marginBottom: 12 }}>For Gamers & Creators</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
                Players, IGLs, Content Creators, Video Editors, GFX Artists, Casters, Coaches — build your professional gaming profile, showcase achievements, and get hired.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {['🏅 Rank & tier showcase', '🎬 Portfolio: clips, thumbnails, videos', '📈 Profile completion score', '💼 Apply to org vacancies', '🤝 Connect with the community'].map(item => (
                  <li key={item} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>{item}</li>
                ))}
              </ul>
              <Link to="/register" className="btn btn-primary btn-full">Create Gamer Profile →</Link>
            </div>

            {/* Org card */}
            <div className="card" style={{ padding: 40, border: '1px solid rgba(0,229,255,0.15)' }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>🏢</div>
              <h3 style={{ color: 'var(--electric)', marginBottom: 12 }}>For Organizations</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
                Esports orgs, content studios, gaming cafes, event companies — build your org profile, post vacancies, and find the best talent India's gaming scene has to offer.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {['🏆 Showcase org achievements', '📋 Post detailed job requirements', '🔍 Filter candidates by rank/tier', '📊 Manage applications pipeline', '✅ Verified organization badge'].map(item => (
                  <li key={item} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>{item}</li>
                ))}
              </ul>
              <Link to="/register/org" className="btn btn-electric btn-full">Register Organization →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-base)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="badge badge-saffron" style={{ marginBottom: 16 }}>Platform Features</div>
            <h2>Everything the Gaming Community Needs</h2>
          </div>

          <div className="grid-3" style={{ gap: 24 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card card-glow" style={{ padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.1rem', color: f.color, marginBottom: 10, fontFamily: 'var(--font-display)' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, rgba(255,107,0,0.08), rgba(0,229,255,0.04))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 16 }}>Ready to Enter the Arena?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 40, fontSize: '1.1rem' }}>
            Join thousands of Indian gamers already building their careers on ArenaX.
          </p>
          <div className="flex-center gap-4" style={{ flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/jobs" className="btn btn-ghost btn-lg">Browse ₹ Opportunities</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ padding: '40px 0', background: 'var(--bg-base)', borderTop: '1px solid var(--border-dim)' }}>
        <div className="container flex-between" style={{ flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="nav-logo" style={{ marginBottom: 8 }}>ARENA<span>X</span></div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>India's Gaming Career Platform 🇮🇳</div>
          </div>
          <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
            {['About', 'Privacy', 'Terms', 'Contact', 'Blog'].map(l => (
              <a key={l} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{l}</a>
            ))}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © 2025 ArenaX. Built for India 🎮
          </div>
        </div>
      </footer>
    </div>
  );
}
