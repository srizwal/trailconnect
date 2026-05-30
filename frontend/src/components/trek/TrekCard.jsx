import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock, Mountain, Heart } from 'lucide-react';
import { format } from 'date-fns';
import './TrekCard.css';

const DIFFICULTY_COLORS = { easy: '#22c55e', moderate: '#f59e0b', hard: '#f97316', extreme: '#ef4444' };

export default function TrekCard({ trek }) {
  const available = trek.availableSeats ?? (trek.totalSeats - (trek.members?.filter(m => m.status === 'confirmed').length || 0));
  const isFull = available <= 0;
  const pct = ((trek.totalSeats - available) / trek.totalSeats) * 100;

  return (
    <Link to={`/treks/${trek._id}`} className="trek-card card">
      <div className="trek-card-img">
        <img
          src={trek.coverImage || `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80`}
          alt={trek.title}
          loading="lazy"
        />
        <div className="trek-card-badges">
          <span className={`badge badge-${trek.difficulty}`}>{trek.difficulty}</span>
          {trek.isFeatured && <span className="badge" style={{background:'var(--peak)',color:'var(--forest)'}}>⭐ Featured</span>}
        </div>
        <div className="trek-card-cost">
          {trek.costPerPerson > 0 ? `$${trek.costPerPerson}` : 'Free'}
        </div>
        <button className="trek-card-like" onClick={e => e.preventDefault()}>
          <Heart size={16} />
        </button>
        {isFull && <div className="trek-full-banner">Full</div>}
      </div>

      <div className="trek-card-body">
        <h3 className="trek-card-title">{trek.title}</h3>
        <p className="trek-card-dest">
          <MapPin size={13} /> {trek.destination}
        </p>

        <div className="trek-card-meta">
          <span><Calendar size={13} /> {trek.date ? format(new Date(trek.date), 'MMM d, yyyy') : '—'}</span>
          <span><Clock size={13} /> {trek.duration}</span>
        </div>

        {trek.elevation?.maxAlt && (
          <p className="trek-card-elev"><Mountain size={13} /> {trek.elevation.maxAlt.toLocaleString()}m altitude</p>
        )}

        <div className="trek-card-seats">
          <div className="seats-bar">
            <div className="seats-fill" style={{ width: `${pct}%`, background: isFull ? '#ef4444' : pct > 75 ? '#f59e0b' : 'var(--forest-light)' }} />
          </div>
          <span className="seats-label">
            <Users size={13} />
            {isFull ? 'Full — join waitlist' : `${available} of ${trek.totalSeats} seats left`}
          </span>
        </div>

        {trek.organizer && (
          <div className="trek-card-organizer">
            <img
              src={trek.organizer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(trek.organizer.name || 'U')}&background=1a4a35&color=fff`}
              alt={trek.organizer.name}
            />
            <span>{trek.organizer.name}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
