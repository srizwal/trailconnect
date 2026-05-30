// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Mountain, Calendar } from 'lucide-react';
import { userAPI } from '../api';
import { useAuth } from '../store/AuthContext';
import TrekCard from '../components/trek/TrekCard';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    Promise.all([userAPI.getProfile(id), userAPI.getUserTreks(id)])
      .then(([pRes, tRes]) => {
        setProfile(pRes.data.user);
        setTreks(tRes.data.treks);
        setFollowing(pRes.data.user.followers?.some(f => f._id === me?._id));
      }).catch(() => toast.error('User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFollow = async () => {
    try {
      await userAPI.follow(id);
      setFollowing(f => !f);
      setProfile(p => ({ ...p, followers: following ? (p.followers || []).filter(f => f._id !== me?._id) : [...(p.followers || []), { _id: me?._id }] }));
    } catch { toast.error('Action failed'); }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><div className="loading-ring" style={{ margin: 'auto' }} /></div>;
  if (!profile) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><h2>User not found</h2></div>;

  const isMe = me?._id === id;
  const EXP_COLORS = { beginner: '#22c55e', intermediate: '#f59e0b', advanced: '#f97316', expert: '#ef4444' };

  return (
    <div style={{ minHeight: '100vh' }} className="page-enter">
      <div style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)', padding: '3rem 0', color: 'white' }}>
        <div className="container" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <img src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=1a4a35&color=fff&size=200`} alt={profile.name} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 4 }}>{profile.name}</h1>
            {profile.location && <p style={{ opacity: 0.75, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}><MapPin size={14} /> {profile.location}</p>}
            {profile.bio && <p style={{ opacity: 0.8, maxWidth: 500, marginBottom: 10, fontSize: '0.92rem', lineHeight: 1.6 }}>{profile.bio}</p>}
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', opacity: 0.85 }}>
              <span><strong>{profile.followers?.length || 0}</strong> followers</span>
              <span><strong>{profile.following?.length || 0}</strong> following</span>
              <span><strong>{profile.completedTreks?.length || 0}</strong> treks</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!isMe && me && <button className="btn btn-peak" onClick={handleFollow}>{following ? 'Unfollow' : 'Follow'}</button>}
            {isMe && <Link to="/dashboard" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Edit Profile</Link>}
          </div>
        </div>
      </div>
      <div className="container" style={{ padding: '2.5rem 0 4rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Treks by {profile.name.split(' ')[0]}</h2>
        {treks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No public treks yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {treks.map(t => <TrekCard key={t._id} trek={t} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
