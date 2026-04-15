import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-void)', flexDirection: 'column', gap: 24 }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <div style={{
          position: 'absolute', inset: 0,
          border: '3px solid var(--border-dim)',
          borderTopColor: 'var(--saffron)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 8,
          border: '2px solid var(--border-dim)',
          borderBottomColor: 'var(--electric)',
          borderRadius: '50%',
          animation: 'spin 1.2s linear infinite reverse',
        }} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--text-primary)' }}>
        ARENA<span style={{ color: 'var(--saffron)' }}>X</span>
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
        Loading the arena...
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
