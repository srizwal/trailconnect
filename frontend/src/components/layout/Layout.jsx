import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import {
  Mountain, Search, Bell, Menu, X, User, LogOut, Map,
  Compass, Shield, MessageCircle, PlusCircle, ChevronDown, Moon, Sun
} from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('tc_theme') || 'light');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tc_theme', theme);
  }, [theme]);

  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="app-shell">
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <Mountain size={24} />
            <span>TrailConnect</span>
          </Link>

          <div className="nav-links">
            <Link to="/explore" className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}>
              <Compass size={16} /> Explore
            </Link>
            <Link to="/guides" className={`nav-link ${location.pathname.startsWith('/guides') ? 'active' : ''}`}>
              <Map size={16} /> Guides
            </Link>
            {user && (
              <Link to="/create-trek" className="btn btn-peak btn-sm">
                <PlusCircle size={15} /> New Trek
              </Link>
            )}
          </div>

          <div className="nav-actions">
            <button className="icon-btn" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              <>
                <Link to="/messages" className="icon-btn">
                  <MessageCircle size={18} />
                </Link>
                <button className="icon-btn">
                  <Bell size={18} />
                </button>
                <div className="profile-menu-wrap">
                  <button className="profile-trigger" onClick={() => setProfileOpen(p => !p)}>
                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a4a35&color=fff`} alt={user.name} />
                    <span className="profile-name">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} />
                  </button>
                  {profileOpen && (
                    <div className="profile-dropdown">
                      <div className="dropdown-header">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                        <span className={`badge badge-${user.role === 'admin' ? 'extreme' : user.role === 'guide' ? 'easy' : 'peak'}`}>{user.role}</span>
                      </div>
                      <Link to="/dashboard" className="dropdown-item"><User size={15} /> Dashboard</Link>
                      <Link to={`/users/${user._id}`} className="dropdown-item"><User size={15} /> Profile</Link>
                      {user.role === 'admin' && <Link to="/admin" className="dropdown-item"><Shield size={15} /> Admin Panel</Link>}
                      <button onClick={handleLogout} className="dropdown-item danger"><LogOut size={15} /> Sign Out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Join Free</Link>
              </div>
            )}

            <button className="mobile-menu-btn" onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/explore" className="mobile-link"><Compass size={16} /> Explore Treks</Link>
            <Link to="/guides" className="mobile-link"><Map size={16} /> Find Guides</Link>
            {user ? (
              <>
                <Link to="/create-trek" className="mobile-link"><PlusCircle size={16} /> Create Trek</Link>
                <Link to="/dashboard" className="mobile-link"><User size={16} /> Dashboard</Link>
                <Link to="/messages" className="mobile-link"><MessageCircle size={16} /> Messages</Link>
                {user.role === 'admin' && <Link to="/admin" className="mobile-link"><Shield size={16} /> Admin</Link>}
                <button onClick={handleLogout} className="mobile-link danger"><LogOut size={16} /> Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-link">Sign In</Link>
                <Link to="/register" className="mobile-link highlight">Join Free</Link>
              </>
            )}
          </div>
        )}
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo"><Mountain size={20} /> TrailConnect</div>
              <p>Connecting adventurers worldwide. Find your tribe, discover your trail.</p>
            </div>
            <div className="footer-col">
              <h4>Explore</h4>
              <Link to="/explore">Browse Treks</Link>
              <Link to="/guides">Find Guides</Link>
              <Link to="/create-trek">Create Trek</Link>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Safety</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2024 TrailConnect. Built for adventurers.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
