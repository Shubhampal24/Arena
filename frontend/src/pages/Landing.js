import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Gamepad2, Users, Briefcase, Zap, Shield, Target } from 'lucide-react';

const FadeInWhenVisible = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  return (
    <motion.div ref={ref} animate={controls} initial="hidden" transition={{ duration: 0.6, delay, ease: 'easeOut' }} variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 30 } }}>
      {children}
    </motion.div>
  );
};

const FEATURES = [
  { icon: <Gamepad2 size={32} className="text-saffron" />, title: 'Pro Gamer Profiles', desc: 'Showcase your stats, rank, and portfolio to top orgs.' },
  { icon: <Briefcase size={32} className="text-electric" />, title: 'Esports Jobs', desc: 'Secure roles from players to managers and casters.' },
  { icon: <Users size={32} className="text-purple-light" />, title: 'Org Management', desc: 'Recruit top talent and manage your rosters effectively.' },
  { icon: <Zap size={32} className="text-saffron" />, title: 'Dynamic Feed', desc: 'Share your highlights and achievements with the community.' },
  { icon: <Shield size={32} className="text-electric" />, title: 'Verified Profiles', desc: 'Stand out with verified pro player and organization badges.' },
  { icon: <Target size={32} className="text-purple-light" />, title: 'Scouting Tools', desc: 'Advanced search filters to find exactly what you need.' },
];

export default function Landing() {
  return (
    <div className="page" style={{ paddingTop: '0' }}>
      
      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="section flex flex-col items-center justify-center text-center" style={{ minHeight: '100vh', background: 'radial-gradient(circle at center, rgba(255,107,0,0.1) 0%, transparent 60%)', padding: '0 20px', marginTop: '-72px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <h1 className="nav-logo" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '16px' }}>
            Arena<span>X</span>
          </h1>
          <p className="font-display text-secondary" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', maxWidth: '700px', margin: '0 auto 40px auto', letterSpacing: '0.05em' }}>
            The Ultimate Network for India's Esports & Gaming Professionals
          </p>
          
          <div className="flex-center gap-4" style={{ flexWrap: 'wrap' }}>
            <Link to="/register/user" className="btn btn-primary btn-lg">
              <Gamepad2 size={24} /> Get Started as Gamer
            </Link>
            <Link to="/register/org" className="btn btn-ghost btn-lg" style={{ borderWidth: '2px' }}>
              <Briefcase size={24} /> Join as Organization
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Features Section ──────────────────────────────────────────────────── */}
      <section className="section container">
        <FadeInWhenVisible>
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <h2 style={{ marginBottom: '16px' }}>Level Up Your <span className="text-saffron text-glow">Career</span></h2>
            <p className="text-secondary" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Whether you're looking for a team to join or talent to recruit, ArenaX gives you the tools to succeed.</p>
          </div>
        </FadeInWhenVisible>

        <div className="grid-3">
          {FEATURES.map((feat, i) => (
            <FadeInWhenVisible key={i} delay={i * 0.1}>
              <div className="card glass-card flex-col items-start" style={{ height: '100%' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '20px' }}>
                  {feat.icon}
                </div>
                <h3 style={{ marginBottom: '12px' }}>{feat.title}</h3>
                <p className="text-secondary">{feat.desc}</p>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────────────── */}
      <section className="section text-center" style={{ background: 'linear-gradient(to top, rgba(0,229,255,0.05), transparent)' }}>
        <FadeInWhenVisible>
          <div className="container">
            <h2 style={{ marginBottom: '24px' }}>Ready to Enter the Arena?</h2>
            <Link to="/login" className="btn btn-electric btn-lg">
              <Zap size={24} /> Sign In Now
            </Link>
          </div>
        </FadeInWhenVisible>
      </section>

    </div>
  );
}
