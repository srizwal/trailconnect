// MessagesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, MessageCircle } from 'lucide-react';
import { messageAPI } from '../api';
import { useAuth } from '../store/AuthContext';
import { format } from 'date-fns';

export function MessagesPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;
    messageAPI.getConversation(roomId)
      .then(r => setMessages(r.data.messages))
      .catch(() => {});
  }, [roomId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !roomId) return;
    setSending(true);
    try {
      const res = await messageAPI.send({ conversation: roomId, content: text });
      setMessages(m => [...m, res.data.message]);
      setText('');
    } catch (_) {} finally { setSending(false); }
  };

  if (!roomId) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
      <MessageCircle size={48} style={{ opacity: 0.3 }} />
      <h3>Your Messages</h3>
      <p style={{ fontSize: '0.9rem' }}>Select a conversation or message a guide/organizer from their profile.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        {messages.map((m, i) => {
          const isMe = m.sender?._id === user?._id;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: '1rem' }}>
              {!isMe && <img src={m.sender?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender?.name||'U')}&background=1a4a35&color=fff`} alt="" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8, alignSelf: 'flex-end', objectFit: 'cover' }} />}
              <div style={{ maxWidth: '70%' }}>
                <div style={{ background: isMe ? 'var(--forest-mid)' : 'var(--mist)', color: isMe ? 'white' : 'var(--text)', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: '0.9rem', lineHeight: 1.5 }}>{m.content}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--stone)', marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>{m.createdAt ? format(new Date(m.createdAt), 'h:mm a') : ''}</div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} style={{ display: 'flex', gap: 10, padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--card-bg)' }}>
        <input className="input" style={{ flex: 1 }} placeholder="Type a message…" value={text} onChange={e => setText(e.target.value)} />
        <button type="submit" className="btn btn-primary" disabled={sending || !text.trim()}><Send size={16} /></button>
      </form>
    </div>
  );
}

export default MessagesPage;
