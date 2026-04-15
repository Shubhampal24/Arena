import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page flex-center" style={{minHeight:'80vh',flexDirection:'column',textAlign:'center',gap:24}}>
      <div style={{fontFamily:'var(--font-mono)',fontSize:'8rem',fontWeight:700,color:'var(--border)',lineHeight:1}}>404</div>
      <h2 style={{color:'var(--text-secondary)'}}>You've wandered outside the arena.</h2>
      <p style={{color:'var(--text-muted)'}}>This page doesn't exist. Let's get you back in the game.</p>
      <Link to="/" className="btn btn-primary">← Back to ArenaX</Link>
    </div>
  );
}