import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-void)', flexDirection: 'column', gap: 24 }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{
          position: 'absolute', inset: 0,
          border: '2px solid rgba(255,255,255,0.05)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 8,
          border: '2px solid rgba(255,255,255,0.05)',
          borderBottomColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse',
        }} />
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-white)' }}>
        Arena
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
