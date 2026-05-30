import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Calendar, Users, Star, Plus, MapPin, Clock, ChevronRight, Award, Compass, BookOpen } from 'lucide-react';
import { bookingAPI, trekAPI, userAPI } from '../api';
import { useAuth } from '../store/AuthContext';
import { format } from 'date-fns';
import './Dashboard.css';

const BADGES = [
  { id: 'first_trek', icon: '🏔', name: 'First Summit', desc: 'Completed your first trek' },
  { id: 'social', icon: '👥', name: 'Trail Friend', desc: 'Followed 5 trekkers' },
  { id: 'organizer', icon: '🗺', name: 'Trail Leader', desc: 'Organized 3 treks' },
  { id: 'explorer', icon: '🌍', name: 'World Explorer', desc: 'Trekked on 3 continents' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [myTreks, setMyTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([
      bookingAPI.getMyBookings(),
      user?._id ? userAPI.getUserTreks(user._id) : Promise.resolve({ data: { treks: [] } })
    ]).then(([bRes, tRes]) => {
      setBookings(bRes.data.bookings);
      setMyTreks(tRes.data.treks);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' && new Date(b.startDate || b.createdAt) > new Date());
  const pastBookings = bookings.filter(b => b.status === 'completed' || new Date(b.startDate || b.createdAt) <= new Date());

  return (
    <div className="dashboard page-enter">
      {/* Profile Header */}
      <div className="dash-header">
        <div className="container dash-header-inner">
          <div className="dash-profile">
            <div className="dash-avatar-wrap">
              <img
                className="dash-avatar"
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=1a4a35&color=fff&size=150`}
                alt={user?.name}
              />
              <div className={`exp-badge exp-${user?.experienceLevel}`}>{user?.experienceLevel}</div>
            </div>
            <div className="dash-profile-info">
              <h1>{user?.name}</h1>
              {user?.location && <p className="dash-location"><MapPin size={14} /> {user.location}</p>}
              {user?.bio && <p className="dash-bio">{user.bio}</p>}
              <div className="dash-social-counts">
                <span><strong>{user?.followers?.length || 0}</strong> followers</span>
                <span><strong>{user?.following?.length || 0}</strong> following</span>
                <span><strong>{user?.completedTreks?.length || 0}</strong> treks</span>
              </div>
            </div>
          </div>
          <div className="dash-header-actions">
            <Link to="/create-trek" className="btn btn-peak"><Plus size={16} /> New Trek</Link>
            <Link to={`/users/${user?._id}`} className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>View Profile</Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="container dash-stats-row">
        {[
          { icon: <Mountain size={20} />, val: user?.completedTreks?.length || 0, label: 'Treks Done' },
          { icon: <Calendar size={20} />, val: upcomingBookings.length, label: 'Upcoming' },
          { icon: <Users size={20} />, val: myTreks.length, label: 'Organized' },
          { icon: <Star size={20} />, val: user?.badges?.length || 0, label: 'Badges' },
        ].map((s, i) => (
          <div key={i} className="dash-stat card">
            <div className="dash-stat-icon">{s.icon}</div>
            <div className="dash-stat-val">{s.val}</div>
            <div className="dash-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="container dash-body">
        {/* Tabs */}
        <div className="dash-tabs">
          {['overview', 'bookings', 'my treks', 'badges'].map(t => (
            <button key={t} className={`dash-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="dash-overview">
            <div className="dash-two-col">
              {/* Upcoming Bookings */}
              <div>
                <div className="dash-section-header">
                  <h3><Calendar size={16} /> Upcoming Trips</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('bookings')}>View all</button>
                </div>
                {upcomingBookings.length === 0 ? (
                  <div className="empty-state card">
                    <Compass size={36} />
                    <p>No upcoming trips</p>
                    <Link to="/explore" className="btn btn-primary btn-sm">Explore Treks</Link>
                  </div>
                ) : (
                  upcomingBookings.slice(0, 3).map(b => <BookingRow key={b._id} booking={b} />)
                )}
              </div>

              {/* My organized treks */}
              <div>
                <div className="dash-section-header">
                  <h3><Mountain size={16} /> My Treks</h3>
                  <Link to="/create-trek" className="btn btn-ghost btn-sm"><Plus size={13} /> New</Link>
                </div>
                {myTreks.length === 0 ? (
                  <div className="empty-state card">
                    <Mountain size={36} />
                    <p>You haven't organized a trek yet</p>
                    <Link to="/create-trek" className="btn btn-primary btn-sm">Create One</Link>
                  </div>
                ) : (
                  myTreks.slice(0, 3).map(trek => (
                    <Link to={`/treks/${trek._id}`} key={trek._id} className="mini-trek-card card">
                      <img src={trek.coverImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=60'} alt="" />
                      <div>
                        <strong>{trek.title}</strong>
                        <span><MapPin size={11} /> {trek.destination}</span>
                        <span><Calendar size={11} /> {format(new Date(trek.date), 'MMM d, yyyy')}</span>
                      </div>
                      <ChevronRight size={16} className="ml-auto" />
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div>
            <h3 className="dash-sub-title">All Bookings ({bookings.length})</h3>
            {loading ? (
              <div>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, marginBottom: '0.75rem', borderRadius: 12 }} />)}</div>
            ) : bookings.length === 0 ? (
              <div className="empty-state card" style={{ padding: '3rem' }}>
                <BookOpen size={40} />
                <p>No bookings yet</p>
                <Link to="/explore" className="btn btn-primary">Explore Treks</Link>
              </div>
            ) : (
              bookings.map(b => <BookingRow key={b._id} booking={b} detailed />)
            )}
          </div>
        )}

        {/* My Treks */}
        {activeTab === 'my treks' && (
          <div>
            <div className="dash-section-header">
              <h3>Treks I Organized ({myTreks.length})</h3>
              <Link to="/create-trek" className="btn btn-primary btn-sm"><Plus size={14} /> New Trek</Link>
            </div>
            {myTreks.length === 0 ? (
              <div className="empty-state card" style={{ padding: '3rem' }}>
                <Mountain size={40} />
                <p>You haven't created any treks yet</p>
                <Link to="/create-trek" className="btn btn-primary">Create Your First Trek</Link>
              </div>
            ) : (
              <div className="my-treks-grid">
                {myTreks.map(trek => (
                  <Link to={`/treks/${trek._id}`} key={trek._id} className="my-trek-card card">
                    <img src={trek.coverImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=60'} alt="" />
                    <div className="my-trek-info">
                      <span className={`badge badge-${trek.difficulty}`}>{trek.difficulty}</span>
                      <strong>{trek.title}</strong>
                      <span><MapPin size={11} /> {trek.destination}</span>
                      <span><Users size={11} /> {trek.members?.length || 0}/{trek.totalSeats} members</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        {activeTab === 'badges' && (
          <div>
            <h3 className="dash-sub-title">Achievement Badges</h3>
            <div className="badges-grid">
              {BADGES.map(b => {
                const earned = user?.badges?.some(ub => ub.name === b.name);
                return (
                  <div key={b.id} className={`badge-card card ${earned ? 'earned' : 'locked'}`}>
                    <div className="badge-icon">{b.icon}</div>
                    <h4>{b.name}</h4>
                    <p>{b.desc}</p>
                    {earned ? <span className="badge-status earned">✓ Earned</span> : <span className="badge-status locked">🔒 Locked</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingRow({ booking, detailed }) {
  const trek = booking.trek;
  const STATUS_COLORS = { confirmed: '#22c55e', pending: '#f59e0b', cancelled: '#ef4444', completed: '#6366f1' };
  return (
    <div className="booking-row card">
      {trek?.coverImage && <img src={trek.coverImage} alt="" className="booking-thumb" />}
      <div className="booking-info">
        <strong>{trek?.title || 'Guide Booking'}</strong>
        {trek?.destination && <span><MapPin size={11} /> {trek.destination}</span>}
        {trek?.date && <span><Calendar size={11} /> {format(new Date(trek.date), 'MMM d, yyyy')}</span>}
        <span>Ref: <code>{booking.bookingRef}</code></span>
      </div>
      <div className="booking-meta">
        <span className="booking-status" style={{ background: STATUS_COLORS[booking.status] + '20', color: STATUS_COLORS[booking.status] }}>
          {booking.status}
        </span>
        <strong>${booking.amount}</strong>
      </div>
    </div>
  );
}
