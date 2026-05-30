import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, MapPin, Shield, Calendar, Globe, MessageCircle, CheckCircle, ChevronRight, Mountain } from 'lucide-react';
import { guideAPI, reviewAPI } from '../api';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';
import './GuideProfile.css';

export default function GuideProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', title: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    Promise.all([
      guideAPI.getOne(id),
      reviewAPI.getGuideReviews(id)
    ]).then(([gRes, rRes]) => {
      setGuide(gRes.data.guide);
      setReviews(rRes.data.reviews);
    }).catch(() => toast.error('Guide not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmittingReview(true);
    try {
      const res = await reviewAPI.create({ guide: id, ...reviewForm });
      setReviews(r => [res.data.review, ...r]);
      setReviewForm({ rating: 5, comment: '', title: '' });
      toast.success('Review posted!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not post review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div className="skeleton" style={{ height: 320, borderRadius: 16, marginBottom: '2rem' }} />
    </div>
  );

  if (!guide) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><h2>Guide not found</h2></div>;

  const guideUser = guide.user || {};
  const stars = Array.from({ length: 5 });

  return (
    <div className="guide-detail page-enter">
      {/* Cover */}
      <div className="guide-cover">
        <img src={guide.coverPhoto || 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1400&q=80'} alt="" />
        <div className="guide-cover-overlay" />
      </div>

      <div className="container guide-layout">
        {/* LEFT */}
        <div className="guide-main">
          {/* Identity */}
          <div className="guide-identity card">
            <div className="guide-avatar-wrap">
              <img className="guide-big-avatar"
                src={guideUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(guideUser.name||'G')}&background=1a4a35&color=fff`}
                alt={guideUser.name} />
              {guide.isVerified && <div className="guide-verified-badge"><Shield size={14} /> Verified</div>}
            </div>
            <div className="guide-identity-info">
              <h1>{guideUser.name}</h1>
              <p className="guide-loc"><MapPin size={14} /> {guide.location || 'Worldwide'}</p>
              <div className="guide-rating-row">
                <div className="stars-display">
                  {stars.map((_, i) => (
                    <Star key={i} size={16}
                      fill={i < Math.round(guide.rating) ? 'var(--peak)' : 'none'}
                      stroke={i < Math.round(guide.rating) ? 'var(--peak)' : 'var(--stone)'}
                    />
                  ))}
                </div>
                <strong>{guide.rating?.toFixed(1) || '—'}</strong>
                <span>({guide.reviewCount} reviews)</span>
                <span className="separator">·</span>
                <span>{guide.totalBookings} trips</span>
              </div>
              <div className="guide-quick-stats">
                <div className="quick-stat"><div className="qs-val">{guide.yearsExperience}</div><div className="qs-label">Years Exp</div></div>
                <div className="quick-stat"><div className="qs-val">{guide.totalBookings}</div><div className="qs-label">Trips</div></div>
                <div className="quick-stat"><div className="qs-val">{guide.completionRate}%</div><div className="qs-label">Completion</div></div>
                <div className="quick-stat"><div className="qs-val">{(guide.languages || []).length}</div><div className="qs-label">Languages</div></div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-tabs">
            {['about', 'photos', 'reviews'].map(t => (
              <button key={t} className={`detail-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'reviews' && <span className="tab-count">{reviews.length}</span>}
              </button>
            ))}
          </div>

          {/* About */}
          {activeTab === 'about' && (
            <div className="tab-content">
              <h3>About {guideUser.name}</h3>
              <p className="guide-bio">{guide.bio || guideUser.bio || 'Experienced mountain guide passionate about helping adventurers reach their goals safely.'}</p>

              <div className="guide-info-grid">
                {guide.languages?.length > 0 && (
                  <div className="guide-info-section">
                    <h4><Globe size={16} /> Languages</h4>
                    <div className="tag-list">{guide.languages.map(l => <span key={l} className="info-tag">{l}</span>)}</div>
                  </div>
                )}
                {guide.specializations?.length > 0 && (
                  <div className="guide-info-section">
                    <h4><Mountain size={16} /> Specializations</h4>
                    <div className="tag-list">{guide.specializations.map(s => <span key={s} className="info-tag">{s}</span>)}</div>
                  </div>
                )}
                {guide.difficultyHandled?.length > 0 && (
                  <div className="guide-info-section">
                    <h4>Difficulty Levels</h4>
                    <div className="tag-list">{guide.difficultyHandled.map(d => <span key={d} className={`badge badge-${d}`}>{d}</span>)}</div>
                  </div>
                )}
                {guide.emergencyTraining?.length > 0 && (
                  <div className="guide-info-section">
                    <h4>🚨 Safety Training</h4>
                    <div className="tag-list">{guide.emergencyTraining.map(t => <span key={t} className="info-tag safety-tag"><CheckCircle size={12} /> {t}</span>)}</div>
                  </div>
                )}
              </div>

              {guide.certifications?.length > 0 && (
                <div className="cert-section">
                  <h4>Certifications</h4>
                  {guide.certifications.map((c, i) => (
                    <div key={i} className="cert-item">
                      <Shield size={16} color="var(--forest-light)" />
                      <div>
                        <strong>{c.name}</strong>
                        <span>{c.issuedBy} · {c.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {guide.serviceAreas?.length > 0 && (
                <div className="guide-info-section" style={{ marginTop: '1.5rem' }}>
                  <h4><MapPin size={16} /> Service Areas</h4>
                  <div className="tag-list">{guide.serviceAreas.map(a => <span key={a} className="info-tag">{a}</span>)}</div>
                </div>
              )}
            </div>
          )}

          {/* Photos */}
          {activeTab === 'photos' && (
            <div className="tab-content">
              <h3>Trip Photos</h3>
              {guide.photos?.length > 0 ? (
                <div className="guide-photos-grid">
                  {guide.photos.map((p, i) => <img key={i} src={p} alt={`Trip ${i + 1}`} className="guide-photo" />)}
                </div>
              ) : <p style={{ color: 'var(--text-muted)' }}>No photos yet.</p>}
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="tab-content">
              <h3>{reviews.length} Reviews</h3>
              <div className="reviews-list">
                {reviews.map((r, i) => (
                  <div key={i} className="review-item card">
                    <div className="review-header">
                      <img src={r.reviewer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.reviewer?.name||'U')}&background=1a4a35&color=fff`} alt="" />
                      <div>
                        <strong>{r.reviewer?.name}</strong>
                        <div className="stars-sm">
                          {stars.map((_, j) => <Star key={j} size={12} fill={j < r.rating ? 'var(--peak)' : 'none'} stroke={j < r.rating ? 'var(--peak)' : 'var(--stone)'} />)}
                        </div>
                      </div>
                    </div>
                    {r.title && <p className="review-title">{r.title}</p>}
                    <p className="review-comment">{r.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews yet. Be the first!</p>}
              </div>

              {user && (
                <div className="review-form-wrap card">
                  <h4>Leave a Review</h4>
                  <form onSubmit={handleReview}>
                    <div className="star-picker">
                      {stars.map((_, i) => (
                        <button type="button" key={i} onClick={() => setReviewForm(f => ({ ...f, rating: i + 1 }))}>
                          <Star size={24} fill={i < reviewForm.rating ? 'var(--peak)' : 'none'} stroke={i < reviewForm.rating ? 'var(--peak)' : 'var(--stone)'} />
                        </button>
                      ))}
                    </div>
                    <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                      <input className="input" placeholder="Review title…" value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                      <textarea className="input" rows={3} placeholder="Share your experience…" required value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                      {submittingReview ? 'Posting…' : 'Post Review'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT Sidebar */}
        <div className="guide-sidebar">
          <div className="guide-booking-card card">
            <div className="guide-price-display">
              <span className="from-label">From</span>
              <span className="guide-price-big">${guide.basePricePerDay}</span>
              <span className="per-day">/day</span>
            </div>
            <div className="guide-avail">
              <span className={`avail-dot ${guide.isAvailable ? 'avail' : 'unavail'}`} />
              {guide.isAvailable ? 'Available for booking' : 'Currently unavailable'}
            </div>
            <button className="btn btn-primary w-full btn-lg" onClick={() => { if (!user) navigate('/login'); else navigate(`/bookings/guide/${guide._id}`); }}>
              Book This Guide <ChevronRight size={16} />
            </button>
            {guide.customTripAvailable && (
              <button className="btn btn-outline w-full" style={{ marginTop: '0.5rem' }}>
                💬 Request Custom Trip
              </button>
            )}
            <div className="guide-response-time">
              <span>⚡ {guide.responseTime || 'Within 24 hours'}</span>
            </div>
          </div>

          <div className="guide-sidebar-info card">
            <h4>Quick Info</h4>
            <div className="sidebar-info-list">
              <div className="sil-item"><span>Experience</span><strong>{guide.yearsExperience} years</strong></div>
              <div className="sil-item"><span>Trips Completed</span><strong>{guide.totalBookings}</strong></div>
              <div className="sil-item"><span>Rating</span><strong>⭐ {guide.rating?.toFixed(1)} ({guide.reviewCount})</strong></div>
              <div className="sil-item"><span>Custom Trips</span><strong>{guide.customTripAvailable ? '✓ Available' : '✗ No'}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
