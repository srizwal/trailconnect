import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Shield, MessageCircle } from 'lucide-react';
import './GuideCard.css';

export default function GuideCard({ guide }) {
  const user = guide.user || {};
  return (
    <Link to={`/guides/${guide._id}`} className="guide-card card">
      <div className="guide-card-cover">
        <img
          src={guide.coverPhoto || 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&q=80'}
          alt=""
        />
      </div>
      <div className="guide-card-body">
        <div className="guide-card-avatar-wrap">
          <img
            className="guide-card-avatar"
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||'G')}&background=1a4a35&color=fff`}
            alt={user.name}
          />
          {guide.isVerified && (
            <div className="guide-verified" title="Verified Guide"><Shield size={12} /></div>
          )}
        </div>
        <div className="guide-card-info">
          <h3>{user.name}</h3>
          <p className="guide-location"><MapPin size={12} /> {guide.location || 'Worldwide'}</p>
          <div className="guide-rating">
            <Star size={13} fill="var(--peak)" stroke="none" />
            <strong>{guide.rating?.toFixed(1) || '—'}</strong>
            <span>({guide.reviewCount || 0} reviews)</span>
          </div>
          <div className="guide-langs">
            {(guide.languages || []).slice(0, 3).map(l => <span key={l} className="lang-tag">{l}</span>)}
          </div>
          <div className="guide-footer">
            <span className="guide-price">From <strong>${guide.basePricePerDay}</strong>/day</span>
            <span className="guide-exp">{guide.yearsExperience}yr exp</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
