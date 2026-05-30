import React, { useState } from 'react';
import { AlertTriangle, X, Phone } from 'lucide-react';
import { getSocket } from '../../hooks/useSocket';
import { useAuth } from '../../store/AuthContext';
import toast from 'react-hot-toast';
import './SOSButton.css';

export default function SOSButton({ trekId }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSOS = async () => {
    setSending(true);
    try {
      const socket = getSocket();
      const coords = await new Promise((res, rej) =>
        navigator.geolocation?.getCurrentPosition(p => res({ lat: p.coords.latitude, lng: p.coords.longitude }), rej)
      ).catch(() => null);

      if (socket) {
        socket.emit('sosAlert', {
          userId: user?._id,
          userName: user?.name,
          trekId,
          coords,
          timestamp: new Date().toISOString(),
          message: '🚨 SOS! Emergency alert triggered.',
        });
      }
      toast.error('🚨 SOS Alert Sent! Emergency contacts notified.', { duration: 6000 });
      setOpen(false);
    } finally { setSending(false); }
  };

  return (
    <>
      <button className="sos-fab" onClick={() => setOpen(true)} title="Emergency SOS">
        <AlertTriangle size={20} />
        <span>SOS</span>
      </button>

      {open && (
        <div className="sos-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="sos-modal card" onClick={e => e.stopPropagation()}>
            <button className="sos-close" onClick={() => setOpen(false)}><X size={18} /></button>
            <div className="sos-icon"><AlertTriangle size={40} /></div>
            <h2>Emergency SOS</h2>
            <p>This will immediately alert your emergency contacts and all trek organizers with your current GPS location.</p>
            <div className="sos-info">
              <Phone size={14} /> Your emergency contact will be notified
            </div>
            <button className="btn btn-danger btn-lg w-full" onClick={handleSOS} disabled={sending}>
              {sending ? 'Sending Alert…' : '🚨 Send SOS Alert'}
            </button>
            <button className="btn btn-ghost w-full" onClick={() => setOpen(false)}>Cancel — I'm Safe</button>
          </div>
        </div>
      )}
    </>
  );
}
