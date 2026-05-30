import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mountain, Search, ArrowRight, Star, Users, MapPin, Shield, Zap, Heart } from 'lucide-react';
import { trekAPI, guideAPI } from '../api';
import TrekCard from '../components/trek/TrekCard';
import GuideCard from '../components/guide/GuideCard';
import './Home.css';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
];

const STATS = [
  { icon: <Mountain size={22} />, value: '12,400+', label: 'Treks Listed' },
  { icon: <Users size={22} />, value: '85,000+', label: 'Adventurers' },
  { icon: <Shield size={22} />, value: '1,200+', label: 'Verified Guides' },
  { icon: <MapPin size={22} />, value: '92', label: 'Countries' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [guides, setGuides] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [heroImg, setHeroImg] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    trekAPI.getFeatured().then(r => setFeatured(r.data.treks)).catch(() => {});
    guideAPI.getAll({ limit: 4 }).then(r => setGuides(r.data.guides)).catch(() => {});
    const timer = setInterval(() => setHeroImg(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="home page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-slider">
          {HERO_IMAGES.map((img, i) => (
            <div key={i} className={`hero-slide ${i === heroImg ? 'active' : ''}`} style={{ backgroundImage: `url(${img})` }} />
          ))}
          <div className="hero-overlay" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge"><Zap size={14} /> Join 85,000+ Adventurers</div>
          <h1 className="hero-title">
            Find Your <span className="hero-accent">Perfect</span><br />
            Trekking Tribe
          </h1>
          <p className="hero-subtitle">
            Discover epic trails, join groups, or hire certified guides.<br />
            Your next great adventure is one click away.
          </p>
          <form className="search-bar" onSubmit={handleSearch}>
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search destination, trail, or trek name…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-peak">Search</button>
          </form>
          <div className="hero-tags">
            {['Everest Base Camp', 'Patagonia', 'Alps', 'Kilimanjaro', 'Appalachian'].map(tag => (
              <button key={tag} onClick={() => navigate(`/explore?search=${tag}`)} className="hero-tag">{tag}</button>
            ))}
          </div>
        </div>
        {/* Scroll dots */}
        <div className="hero-dots">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} className={`hero-dot ${i === heroImg ? 'active' : ''}`} onClick={() => setHeroImg(i)} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-strip">
        <div className="container stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-icon">{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Treks */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-tag">🏔 Hand-picked for you</div>
              <h2 className="section-title">Featured Treks</h2>
            </div>
            <Link to="/explore" className="btn btn-outline btn-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {featured.length === 0 ? (
            <div className="treks-grid">
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{height:340,borderRadius:16}} />)}
            </div>
          ) : (
            <div className="treks-grid">
              {featured.map(trek => <TrekCard key={trek._id} trek={trek} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why TrailConnect */}
      <section className="why-section">
        <div className="container">
          <div className="section-tag">✦ Why TrailConnect</div>
          <h2 className="section-title">Everything You Need for the Mountains</h2>
          <div className="features-grid">
            {[
              { icon: '🗺️', title: 'Verified Routes', desc: 'Every trek route is verified with accurate elevation, distance, and difficulty ratings.' },
              { icon: '👥', title: 'Group Management', desc: 'Create or join groups with live seat availability and smart waitlist system.' },
              { icon: '🧭', title: 'Certified Guides', desc: 'Browse 1,200+ UIAGM-certified mountain guides with reviews and availability.' },
              { icon: '🚨', title: 'Safety First', desc: 'SOS alerts, live location sharing, emergency contacts — we keep you safe on trail.' },
              { icon: '💬', title: 'Trek Chat', desc: 'Real-time group chat to coordinate with your trekking crew before and during the trip.' },
              { icon: '🏅', title: 'Achievement System', desc: 'Earn badges, track your progress, and show off your completed summits.' },
            ].map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Guides */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-tag">🧭 Expert Guides</div>
              <h2 className="section-title">Top Rated Guides</h2>
            </div>
            <Link to="/guides" className="btn btn-outline btn-sm">
              All guides <ArrowRight size={14} />
            </Link>
          </div>
          {guides.length === 0 ? (
            <div className="guides-row">
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{height:280,borderRadius:16}} />)}
            </div>
          ) : (
            <div className="guides-row">
              {guides.map(guide => <GuideCard key={guide._id} guide={guide} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="cta-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80)' }} />
        <div className="cta-overlay" />
        <div className="container cta-content">
          <h2>Ready for Your Next Summit?</h2>
          <p>Join thousands of trekkers discovering the world's most iconic trails.</p>
          <div className="cta-btns">
            <Link to="/explore" className="btn btn-peak btn-lg">Explore Treks</Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{borderColor:'white',color:'white'}}>Join Free</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
