import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Users, Clock, Mountain, ArrowLeft, Share2,
  Heart, MessageCircle, AlertTriangle, CheckCircle, Send, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { trekAPI, bookingAPI } from '../api';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';
import './TrekDetail.css';

const DIFF_META = {
  easy:     { color: '#22c55e', label: 'Easy', desc: 'Suitable for beginners' },
  moderate: { color: '#f59e0b', label: 'Moderate', desc: 'Some experience helpful' },
  hard:     { color: '#f97316', label: 'Hard', desc: 'Good fitness required' },
  extreme:  { color: '#ef4444', label: 'Extreme', desc: 'Expert trekkers only' },
};

export default function TrekDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    trekAPI.getOne(id)
      .then(r => setTrek(r.data.trek))
      .catch(() => toast.error('Trek not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = async () => {
    if (!user) return navigate('/login');
    setJoining(true);
    try {
      const res = await trekAPI.join(id);
      toast.success(res.data.message);
      setTrek(t => ({ ...t, members: [...(t.members || []), { user: user, status: res.data.status, joinedAt: new Date() }] }));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not join trek');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    setJoining(true);
    try {
      await trekAPI.leave(id);
      toast.success('Left trek');
      setTrek(t => ({ ...t, members: (t.members || []).filter(m => m.user?._id !== user?._id) }));
    } catch (e) {
      toast.error('Could not leave');
    } finally {
      setJoining(false);
    }
  };

  const handleLike = async () => {
    if (!user) return navigate('/login');
    await trekAPI.like(id);
    setTrek(t => {
      const liked = t.likes?.includes(user._id);
      return { ...t, likes: liked ? t.likes.filter(l => l !== user._id) : [...(t.likes || []), user._id] };
    });
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!user) return navigate('/login');
    try {
      const res = await trekAPI.comment(id, comment);
      setTrek(t => ({ ...t, comments: res.data.comments }));
      setComment('');
    } catch (e) {
      toast.error('Could not post comment');
    }
  };

  if (loading) return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div className="skeleton" style={{ height: 420, borderRadius: 16, marginBottom: '2rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          {[80, 50, 50, 80, 60].map((h, i) => <div key={i} className="skeleton" style={{ height: h, marginBottom: '1rem', borderRadius: 8 }} />)}
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
      </div>
    </div>
  );

  if (!trek) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><h2>Trek not found</h2></div>;

  const isMember = trek.members?.some(m => (m.user?._id || m.user) === user?._id);
  const isOrganizer = trek.organizer?._id === user?._id;
  const confirmed = trek.members?.filter(m => m.status === 'confirmed').length || 0;
  const available = trek.totalSeats - confirmed;
  const pct = (confirmed / trek.totalSeats) * 100;
  const liked = trek.likes?.includes(user?._id);
  const images = [trek.coverImage, ...(trek.images || [])].filter(Boolean);
  const diff = DIFF_META[trek.difficulty] || DIFF_META.easy;

  return (
    <div className="trek-detail page-enter">
      {/* Hero gallery */}
      <div className="detail-gallery">
        <div className="gallery-main" onClick={() => setImgIdx(i => (i + 1) % images.length)}>
          <img src={images[imgIdx] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'} alt={trek.title} />
          <div className="gallery-overlay">
            <Link to="/explore" className="btn btn-outline back-btn">
              <ArrowLeft size={15} /> Back
            </Link>
            <div className="gallery-actions">
              <button className="gallery-btn" onClick={e => { e.stopPropagation(); handleLike(); }}>
                <Heart size={18} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : 'white'} />
                {trek.likes?.length || 0}
              </button>
              <button className="gallery-btn" onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                <Share2 size={18} />
              </button>
            </div>
          </div>
          {images.length > 1 && (
            <div className="gallery-dots">
              {images.map((_, i) => <span key={i} className={`g-dot ${i === imgIdx ? 'active' : ''}`} />)}
            </div>
          )}
        </div>
      </div>

      <div className="container detail-layout">
        {/* LEFT: Content */}
        <div className="detail-main">
          <div className="detail-header">
            <div>
              <div className="detail-tags">
                <span className={`badge badge-${trek.difficulty}`}>{diff.label}</span>
                {trek.isFeatured && <span className="badge" style={{background:'var(--peak)',color:'var(--forest)'}}>⭐ Featured</span>}
                <span className="badge" style={{background:'var(--mist)',color:'var(--text-muted)'}}>{trek.status}</span>
              </div>
              <h1 className="detail-title">{trek.title}</h1>
              <p className="detail-dest"><MapPin size={16} /> {trek.destination}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-tabs">
            {['overview', 'route', 'members', 'discussion'].map(tab => (
              <button key={tab} className={`detail-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'members' && <span className="tab-count">{trek.members?.length || 0}</span>}
                {tab === 'discussion' && <span className="tab-count">{trek.comments?.length || 0}</span>}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="detail-stats-grid">
                {[
                  { icon: <Calendar size={18} />, label: 'Date', val: format(new Date(trek.date), 'MMMM d, yyyy') },
                  { icon: <Clock size={18} />, label: 'Duration', val: trek.duration },
                  { icon: <MapPin size={18} />, label: 'Meeting Point', val: trek.meetingLocation },
                  { icon: <Mountain size={18} />, label: 'Max Altitude', val: trek.elevation?.maxAlt ? `${trek.elevation.maxAlt.toLocaleString()} m` : 'N/A' },
                  { icon: <Mountain size={18} />, label: 'Elevation Gain', val: trek.elevation?.gain ? `${trek.elevation.gain.toLocaleString()} m` : 'N/A' },
                  { icon: '📏', label: 'Distance', val: trek.distance ? `${trek.distance} km` : 'N/A' },
                ].map((s, i) => (
                  <div key={i} className="detail-stat-item">
                    <div className="detail-stat-icon">{s.icon}</div>
                    <div><div className="detail-stat-label">{s.label}</div><div className="detail-stat-val">{s.val}</div></div>
                  </div>
                ))}
              </div>

              <h3>About this Trek</h3>
              <p className="detail-description">{trek.description}</p>

              {trek.requiredEquipment?.length > 0 && (
                <div className="equipment-section">
                  <h3>Required Equipment</h3>
                  <div className="equipment-grid">
                    {trek.requiredEquipment.map((e, i) => (
                      <div key={i} className="equipment-item"><CheckCircle size={14} color="var(--forest-light)" /> {e}</div>
                    ))}
                  </div>
                </div>
              )}

              {trek.difficulty === 'extreme' && (
                <div className="warning-box">
                  <AlertTriangle size={18} /> <strong>Extreme difficulty warning</strong> — This trek requires advanced mountaineering skills, excellent physical fitness, and proper high-altitude experience.
                </div>
              )}
            </div>
          )}

          {/* Members */}
          {activeTab === 'members' && (
            <div className="tab-content">
              <h3>{confirmed} of {trek.totalSeats} confirmed members</h3>
              <div className="members-grid">
                {trek.members?.map((m, i) => (
                  <div key={i} className={`member-card ${m.status === 'waitlisted' ? 'waitlisted' : ''}`}>
                    <img
                      src={m.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.user?.name || 'U')}&background=1a4a35&color=fff`}
                      alt={m.user?.name}
                    />
                    <div className="member-info">
                      <strong>{m.user?.name || 'Member'}</strong>
                      <span>{m.status === 'waitlisted' ? '⏳ Waitlisted' : '✅ Confirmed'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussion */}
          {activeTab === 'discussion' && (
            <div className="tab-content">
              <h3>Group Discussion</h3>
              <div className="comments-list">
                {(trek.comments || []).map((c, i) => (
                  <div key={i} className="comment-item">
                    <img
                      src={c.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name || 'U')}&background=1a4a35&color=fff`}
                      alt={c.user?.name}
                    />
                    <div className="comment-body">
                      <div className="comment-header">
                        <strong>{c.user?.name || 'User'}</strong>
                        <span>{format(new Date(c.createdAt), 'MMM d')}</span>
                      </div>
                      <p>{c.text}</p>
                    </div>
                  </div>
                ))}
                {trek.comments?.length === 0 && <p className="no-comments">No messages yet. Be the first!</p>}
              </div>
              <form className="comment-form" onSubmit={handleComment}>
                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=1a4a35&color=fff`} alt="" />
                <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a message…" required />
                <button type="submit" className="btn btn-primary btn-sm"><Send size={14} /></button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT: Sidebar */}
        <div className="detail-sidebar">
          <div className="sidebar-card card">
            <div className="sidebar-price">
              {trek.costPerPerson > 0 ? (
                <><span className="price-amount">${trek.costPerPerson}</span><span className="price-label">/person</span></>
              ) : (
                <span className="price-amount" style={{color:'var(--forest-light)'}}>Free</span>
              )}
            </div>

            <div className="seat-progress">
              <div className="seat-bar">
                <div className="seat-fill" style={{ width: `${pct}%`, background: available === 0 ? '#ef4444' : pct > 75 ? '#f59e0b' : 'var(--forest-light)' }} />
              </div>
              <div className="seat-info">
                <span><Users size={14} /> {confirmed}/{trek.totalSeats} members</span>
                <span className={available === 0 ? 'text-danger' : ''}>{available === 0 ? 'Full' : `${available} seats left`}</span>
              </div>
            </div>

            {isOrganizer ? (
              <div className="organizer-actions">
                <button className="btn btn-outline w-full">Edit Trek</button>
              </div>
            ) : isMember ? (
              <button className="btn btn-outline w-full" onClick={handleLeave} disabled={joining}>
                {joining ? 'Leaving…' : '✓ You\'re in — Leave trek'}
              </button>
            ) : (
              <button className="btn btn-primary w-full btn-lg" onClick={handleJoin} disabled={joining}>
                {joining ? 'Joining…' : available === 0 ? 'Join Waitlist' : 'Join Trek'}
                <ChevronRight size={16} />
              </button>
            )}

            <div className="sidebar-meta">
              <div className="sidebar-meta-item"><span>Meeting</span><strong>{trek.meetingLocation}</strong></div>
              <div className="sidebar-meta-item"><span>Date</span><strong>{format(new Date(trek.date), 'MMM d, yyyy')}</strong></div>
              <div className="sidebar-meta-item"><span>Duration</span><strong>{trek.duration}</strong></div>
              <div className="sidebar-meta-item"><span>Difficulty</span><strong style={{color: diff.color}}>{diff.label}</strong></div>
            </div>
          </div>

          {/* Organizer card */}
          {trek.organizer && (
            <div className="organizer-card card">
              <h4>Organized by</h4>
              <div className="organizer-info">
                <img
                  src={trek.organizer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(trek.organizer.name)}&background=1a4a35&color=fff`}
                  alt={trek.organizer.name}
                />
                <div>
                  <strong>{trek.organizer.name}</strong>
                  <span>{trek.organizer.experienceLevel} trekker</span>
                </div>
              </div>
              <Link to={`/users/${trek.organizer._id}`} className="btn btn-outline btn-sm w-full">View Profile</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
