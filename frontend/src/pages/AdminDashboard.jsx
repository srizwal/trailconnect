import React, { useState, useEffect } from 'react';
import { Users, Mountain, Shield, DollarSign, TrendingUp, CheckCircle, Ban, Star } from 'lucide-react';
import { adminAPI } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const MOCK_CHART = [
  { month: 'Jan', bookings: 65, revenue: 4200 },
  { month: 'Feb', bookings: 82, revenue: 5800 },
  { month: 'Mar', bookings: 110, revenue: 7100 },
  { month: 'Apr', bookings: 95, revenue: 6500 },
  { month: 'May', bookings: 130, revenue: 9200 },
  { month: 'Jun', bookings: 148, revenue: 11400 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getUsers()])
      .then(([sRes, uRes]) => {
        setStats(sRes.data.stats);
        setUsers(uRes.data.users);
      }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleBanUser = async (id) => {
    try {
      await adminAPI.banUser(id);
      setUsers(u => u.map(user => user._id === id ? { ...user, isActive: false } : user));
      toast.success('User banned');
    } catch (e) { toast.error('Failed'); }
  };

  return (
    <div className="admin-page page-enter">
      <div className="admin-header">
        <div className="container">
          <h1>⚙️ Admin Dashboard</h1>
          <p>Manage TrailConnect platform</p>
        </div>
      </div>

      <div className="container admin-body">
        {/* Stat cards */}
        {loading ? (
          <div className="admin-stats-grid">
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />)}
          </div>
        ) : (
          <div className="admin-stats-grid">
            {[
              { icon: <Users size={22} />, val: stats?.users, label: 'Total Users', color: '#6366f1' },
              { icon: <Mountain size={22} />, val: stats?.treks, label: 'Total Treks', color: 'var(--forest-light)' },
              { icon: <Shield size={22} />, val: stats?.guides, label: 'Guides', color: 'var(--peak)' },
              { icon: <DollarSign size={22} />, val: `$${(stats?.revenue || 0).toLocaleString()}`, label: 'Total Revenue', color: '#22c55e' },
            ].map((s, i) => (
              <div key={i} className="admin-stat card">
                <div className="admin-stat-icon" style={{ background: s.color + '20', color: s.color }}>{s.icon}</div>
                <div className="admin-stat-val">{s.val}</div>
                <div className="admin-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="dash-tabs" style={{ marginBottom: '2rem' }}>
          {['overview', 'users', 'guides', 'treks'].map(t => (
            <button key={t} className={`dash-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Charts */}
        {activeTab === 'overview' && (
          <div className="admin-charts">
            <div className="chart-card card">
              <h3><TrendingUp size={16} /> Monthly Bookings</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={MOCK_CHART}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="var(--forest-light)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card card">
              <h3><DollarSign size={16} /> Monthly Revenue ($)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={MOCK_CHART}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--peak)" strokeWidth={2} dot={{ fill: 'var(--peak)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="admin-table-wrap card">
            <div className="admin-table-header">
              <h3>All Users ({users.length})</h3>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className={!u.isActive ? 'row-banned' : ''}>
                    <td>
                      <div className="user-cell">
                        <img src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=1a4a35&color=fff`} alt="" />
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="td-muted">{u.email}</td>
                    <td><span className={`badge badge-${u.role === 'admin' ? 'extreme' : u.role === 'guide' ? 'easy' : 'moderate'}`}>{u.role}</span></td>
                    <td>
                      <span className={`status-dot ${u.isActive ? 'active' : 'banned'}`}>
                        {u.isActive ? '● Active' : '● Banned'}
                      </span>
                    </td>
                    <td className="td-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        {u.isActive && u.role !== 'admin' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleBanUser(u._id)}>
                            <Ban size={12} /> Ban
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Guides placeholder */}
        {activeTab === 'guides' && (
          <div className="admin-table-wrap card">
            <div className="admin-table-header"><h3>Guide Verification Queue</h3></div>
            <div className="empty-state" style={{ padding: '3rem' }}>
              <Shield size={40} />
              <p>All guides have been reviewed</p>
            </div>
          </div>
        )}

        {/* Treks placeholder */}
        {activeTab === 'treks' && (
          <div className="admin-table-wrap card">
            <div className="admin-table-header"><h3>Trek Moderation</h3></div>
            <div className="empty-state" style={{ padding: '3rem' }}>
              <Mountain size={40} />
              <p>No treks pending moderation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
