// BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trekAPI, guideAPI, bookingAPI } from '../api';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, Users, CreditCard, Shield, CheckCircle } from 'lucide-react';

export function BookingPage() {
  const { type, id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ numberOfPeople: 1, specialRequests: '', startDate: '', endDate: '', healthForm: { agreedToTerms: false, hasConditions: false, conditions: '' } });
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetch = type === 'trek' ? trekAPI.getOne(id) : guideAPI.getOne(id);
    fetch.then(r => setItem(type === 'trek' ? r.data.trek : r.data.guide))
         .catch(() => toast.error('Not found'))
         .finally(() => setLoading(false));
  }, [type, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.healthForm.agreedToTerms) return toast.error('Please agree to the terms');
    setSubmitting(true);
    try {
      const payload = {
        bookingType: type,
        [type === 'trek' ? 'trekId' : 'guideId']: id,
        ...form,
        startDate: type === 'trek' ? item.date : form.startDate,
        endDate: type === 'trek' ? item.endDate : form.endDate,
      };
      const res = await bookingAPI.create(payload);
      setBooking(res.data.booking);
      setStep(3);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><div className="loading-ring" style={{ margin: 'auto' }} /></div>;

  const amount = type === 'trek'
    ? (item?.costPerPerson || 0) * form.numberOfPeople
    : (() => { const days = form.startDate && form.endDate ? Math.max(1, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000)) : 1; return (item?.basePricePerDay || 0) * days * form.numberOfPeople; })();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--snow)', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: 700 }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          {['Details', 'Health Form', 'Confirmation'].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > i ? 'var(--forest-mid)' : step === i + 1 ? 'var(--forest-mid)' : 'var(--mist)', color: step >= i + 1 ? 'white' : 'var(--stone)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: '0.85rem', color: step === i + 1 ? 'var(--text)' : 'var(--text-muted)', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? 'var(--forest-mid)' : 'var(--border)' }} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={e => { e.preventDefault(); setStep(2); }} className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Booking Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Number of People</label>
                <input className="input" type="number" min={1} max={20} value={form.numberOfPeople} onChange={e => setForm(f => ({ ...f, numberOfPeople: Number(e.target.value) }))} />
              </div>
              {type === 'guide' && (
                <>
                  <div className="input-group"><label className="input-label">Start Date</label><input className="input" type="date" required value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
                  <div className="input-group"><label className="input-label">End Date</label><input className="input" type="date" required value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
                </>
              )}
              <div className="input-group">
                <label className="input-label">Special Requests</label>
                <textarea className="input" rows={3} placeholder="Dietary needs, accessibility, etc." value={form.specialRequests} onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))} />
              </div>
              <div style={{ background: 'var(--mist)', borderRadius: 12, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                  <span>Total</span><span style={{ color: 'var(--forest-mid)' }}>${amount}</span>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full">Continue</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Health & Safety Form</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.healthForm.hasConditions} onChange={e => setForm(f => ({ ...f, healthForm: { ...f.healthForm, hasConditions: e.target.checked } }))} style={{ marginTop: 3 }} />
                <span style={{ fontSize: '0.9rem' }}>I have pre-existing health conditions that the organizer should know about</span>
              </label>
              {form.healthForm.hasConditions && (
                <div className="input-group">
                  <label className="input-label">Health Conditions</label>
                  <textarea className="input" rows={3} placeholder="Please describe any relevant conditions…" value={form.healthForm.conditions} onChange={e => setForm(f => ({ ...f, healthForm: { ...f.healthForm, conditions: e.target.value } }))} />
                </div>
              )}
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" required checked={form.healthForm.agreedToTerms} onChange={e => setForm(f => ({ ...f, healthForm: { ...f.healthForm, agreedToTerms: e.target.checked } }))} style={{ marginTop: 3 }} />
                <span style={{ fontSize: '0.9rem' }}>I agree to the safety guidelines and understand the risks involved in trekking activities</span>
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-outline btn-lg" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
                <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={submitting}>{submitting ? 'Booking…' : `Confirm — $${amount}`}</button>
              </div>
            </div>
          </form>
        )}

        {step === 3 && booking && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle size={56} color="var(--forest-light)" style={{ margin: '0 auto 1rem' }} />
            <h2>Booking Confirmed! 🎉</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>Your adventure awaits. Reference: <code style={{ background: 'var(--mist)', padding: '2px 8px', borderRadius: 4 }}>{booking.bookingRef}</code></p>
            {booking.qrCode && <img src={booking.qrCode} alt="QR Code" style={{ width: 160, margin: '0 auto 1.5rem', borderRadius: 12 }} />}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
              <button className="btn btn-outline" onClick={() => navigate('/explore')}>Explore More</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;
