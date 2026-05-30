import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)', color: 'white' }}>
      <Mountain size={80} style={{ opacity: 0.3, marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: 'clamp(4rem, 15vw, 8rem)', fontWeight: 900, lineHeight: 1, opacity: 0.15, fontFamily: 'Syne' }}>404</h1>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem', marginTop: '-1rem' }}>Trail Not Found</h2>
      <p style={{ opacity: 0.75, maxWidth: 360, marginBottom: '2rem', lineHeight: 1.6 }}>
        Looks like you've gone off the map. This trail doesn't exist or has been removed.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-peak btn-lg"><Home size={16} /> Go Home</Link>
        <Link to="/explore" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}><Compass size={16} /> Explore Treks</Link>
      </div>
    </div>
  );
}
