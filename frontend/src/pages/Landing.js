import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Briefcase, Zap, Shield, Target, ArrowRight, Star, CheckCircle2, Sparkles } from 'lucide-react';

const FadeInWhenVisible = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  return (
    <motion.div 
      ref={ref} 
      animate={controls} 
      initial="hidden" 
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }} 
      variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 40 } }}
    >
      {children}
    </motion.div>
  );
};

const FEATURES = [
  { icon: <Star size={24} />, title: 'Elite Profiles', desc: 'Craft a professional portfolio that stands out to top-tier organizations.' },
  { icon: <Briefcase size={24} />, title: 'Global Opportunities', desc: 'Access exclusive job listings from leading tech and gaming firms.' },
  { icon: <Users size={24} />, title: 'Network at Scale', desc: 'Connect with thousands of verified professionals and mentors.' },
  { icon: <Zap size={24} />, title: 'Real-time Feed', desc: 'Stay updated with industry trends and share your latest achievements.' },
  { icon: <Shield size={24} />, title: 'Verified Trust', desc: 'Build credibility with our multi-step verification for users and orgs.' },
  { icon: <Target size={24} />, title: 'Precision Search', desc: 'Find the perfect match with advanced AI-powered discovery filters.' },
];

export default function Landing() {
  return (
    <div className="w-full">
      
      {/* Hero Section */}
      <section className="h-screen flex-center relative overflow-hidden px-6">
        <div className="auth-bg-glow" style={{ top: '20%', left: '50%', width: '800px', height: '800px', opacity: 0.15 }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="container relative z-10 text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-bold text-primary tracking-wider uppercase">Now in Private Beta</span>
            </div>
          </div>

          <h1 className="mb-8 leading-tight">
            Build the Future of <br/>
            <span className="text-gradient">Professional Excellence</span>
          </h1>
          
          <p className="text-secondary text-xl max-w-2xl mx-auto mb-12 font-medium">
            Arena is the premier talent network for the next generation of professionals. 
            Connect, recruit, and excel in a community built for scale.
          </p>
          
          <div className="flex flex-center gap-4 wrap">
            <Link to="/register" className="btn btn-primary px-8 py-4 rounded-xl shadow-primary gap-3">
              Join the Network <ArrowRight size={20} />
            </Link>
            <Link to="/discover" className="btn btn-secondary px-8 py-4 rounded-xl gap-3">
              Explore Jobs
            </Link>
          </div>

          <div className="mt-16 flex flex-center gap-10 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-success" />
              <span className="text-xs font-bold tracking-widest uppercase">10k+ Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-success" />
              <span className="text-xs font-bold tracking-widest uppercase">500+ Verified Orgs</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-void border-t border-white/5">
        <div className="container">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="mb-4">Platform Ecosystem</h2>
              <p className="text-secondary text-lg max-w-xl mx-auto">
                Everything you need to manage your professional lifecycle in one place.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <FadeInWhenVisible key={i} delay={i * 0.05}>
                <div className="glass-surface p-8 h-full group hover:border-primary transition-all">
                  <div className="w-14 h-14 bg-void border rounded-2xl flex-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                    {feat.icon}
                  </div>
                  <h3 className="mb-4 text-xl">{feat.title}</h3>
                  <p className="text-secondary leading-relaxed font-medium">{feat.desc}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Social Proof Section */}
      <section className="section-padding bg-base overflow-hidden relative">
         <div className="auth-bg-glow" style={{ top: '50%', right: '-10%', width: '400px', height: '400px', opacity: 0.1 }} />
         <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <FadeInWhenVisible>
                  <div className="space-y-6">
                     <h2 className="text-gradient">Designed for the Elite.</h2>
                     <p className="text-secondary text-lg leading-relaxed">
                        Our platform is engineered for high-performance networking. We provide the tools you need to showcase your expertise with high-fidelity profiles and real-time engagement data.
                     </p>
                     <div className="space-y-4 pt-4">
                        {['Verified Credibility', 'AI-Powered Discovery', 'Seamless Recruiting'].map((text) => (
                           <div key={text} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-primary/20 flex-center text-primary">
                                 <CheckCircle2 size={12} />
                              </div>
                              <span className="text-white font-bold">{text}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </FadeInWhenVisible>
               <FadeInWhenVisible delay={0.2}>
                  <div className="relative">
                     <div className="glass-surface p-4 rounded-3xl rotate-2 shadow-2xl bg-gradient-to-br from-white/5 to-transparent">
                        <div className="aspect-video bg-void rounded-2xl overflow-hidden border">
                           <div className="w-full h-full bg-primary/5 flex-center flex-col gap-4 text-muted">
                              <Users size={48} />
                              <span className="text-xs font-bold tracking-widest uppercase">Ecosystem Preview</span>
                           </div>
                        </div>
                     </div>
                     <div className="absolute -bottom-6 -left-6 glass-surface p-6 rounded-2xl -rotate-3 shadow-xl hidden sm:block">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary flex-center text-white font-black">A</div>
                           <div>
                              <p className="text-sm font-bold text-white">Top Professional</p>
                              <p className="text-[10px] text-muted">Verified Tier 1</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </FadeInWhenVisible>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container">
          <FadeInWhenVisible>
            <div className="glass-surface py-20 px-10 text-center relative overflow-hidden rounded-[40px] border-primary/20">
              <div className="auth-bg-glow" style={{ bottom: '-50%', left: '50%', width: '600px', height: '600px', opacity: 0.15 }} />
              
              <h2 className="mb-6">Ready to Scale Your Career?</h2>
              <p className="text-secondary text-xl max-w-xl mx-auto mb-10 font-medium">
                Join thousands of professionals already building their future on Arena.
              </p>
              <div className="flex flex-center gap-4">
                <Link to="/register" className="btn btn-primary px-10 py-5 rounded-2xl text-lg shadow-primary">
                  Get Started for Free
                </Link>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Simple Professional Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container flex-between wrap gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-black text-xl tracking-tighter text-white">ARENA<span className="text-primary">X</span></span>
            <span className="text-xs text-muted font-medium">© 2026 Arena Network. Built for excellence.</span>
          </div>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Security', 'Support'].map((link) => (
               <a key={link} href="#" className="text-xs font-bold text-muted hover:text-primary transition-colors tracking-widest uppercase">{link}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
