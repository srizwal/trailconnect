import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mountain, Plus, X, AlertTriangle } from 'lucide-react';
import { trekAPI } from '../api';
import toast from 'react-hot-toast';
import './CreateTrek.css';

const DIFFICULTIES = ['easy', 'moderate', 'hard', 'extreme'];

export default function CreateTrek() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [equipInput, setEquipInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { isPublic: true, currency: 'USD', costPerPerson: 0 }
  });

  const difficulty = watch('difficulty');

  const addEquipment = () => {
    const val = equipInput.trim();
    if (val && !equipment.includes(val)) {
      setEquipment(e => [...e, val]);
      setEquipInput('');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        requiredEquipment: equipment,
        costPerPerson: Number(data.costPerPerson),
        totalSeats: Number(data.totalSeats),
      };
      const res = await trekAPI.create(payload);
      toast.success('Trek created! 🎉');
      navigate(`/treks/${res.data.trek._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create trek');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page page-enter">
      <div className="create-header">
        <div className="container">
          <div className="create-header-icon"><Mountain size={28} /></div>
          <h1>Create a Trek</h1>
          <p>Share your adventure with the TrailConnect community</p>
        </div>
      </div>

      <div className="container create-body">
        <form className="create-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Info */}
          <div className="form-section card">
            <h2 className="form-section-title">📋 Basic Information</h2>
            <div className="form-grid">
              <div className="input-group form-full">
                <label className="input-label">Trek Title *</label>
                <input className={`input ${errors.title ? 'input-error' : ''}`}
                  placeholder="e.g. Everest Base Camp Classic"
                  {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'At least 5 characters' } })} />
                {errors.title && <span className="field-error">{errors.title.message}</span>}
              </div>

              <div className="input-group form-full">
                <label className="input-label">Description *</label>
                <textarea className={`input textarea ${errors.description ? 'input-error' : ''}`}
                  rows={4} placeholder="Describe the trek experience, highlights, what to expect…"
                  {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'At least 20 characters' } })} />
                {errors.description && <span className="field-error">{errors.description.message}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Destination *</label>
                <input className={`input ${errors.destination ? 'input-error' : ''}`}
                  placeholder="e.g. Everest Base Camp, Nepal"
                  {...register('destination', { required: 'Destination is required' })} />
                {errors.destination && <span className="field-error">{errors.destination.message}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Meeting Location *</label>
                <input className={`input ${errors.meetingLocation ? 'input-error' : ''}`}
                  placeholder="e.g. Lukla Airport, Gate 2"
                  {...register('meetingLocation', { required: 'Meeting location is required' })} />
                {errors.meetingLocation && <span className="field-error">{errors.meetingLocation.message}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Cover Image URL</label>
                <input className="input" placeholder="https://..." {...register('coverImage')} />
              </div>

              <div className="input-group">
                <label className="input-label">Visibility</label>
                <select className="input" {...register('isPublic')}>
                  <option value={true}>🌍 Public — anyone can find it</option>
                  <option value={false}>🔒 Private — invite only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Trek Details */}
          <div className="form-section card">
            <h2 className="form-section-title">🏔 Trek Details</h2>
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Difficulty *</label>
                <select className={`input ${errors.difficulty ? 'input-error' : ''}`}
                  {...register('difficulty', { required: 'Select difficulty' })}>
                  <option value="">Select difficulty…</option>
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
                {errors.difficulty && <span className="field-error">{errors.difficulty.message}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Duration *</label>
                <input className={`input ${errors.duration ? 'input-error' : ''}`}
                  placeholder="e.g. 14 days"
                  {...register('duration', { required: 'Duration is required' })} />
                {errors.duration && <span className="field-error">{errors.duration.message}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Start Date *</label>
                <input type="datetime-local" className={`input ${errors.date ? 'input-error' : ''}`}
                  {...register('date', { required: 'Date is required' })} />
                {errors.date && <span className="field-error">{errors.date.message}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">End Date</label>
                <input type="datetime-local" className="input" {...register('endDate')} />
              </div>

              <div className="input-group">
                <label className="input-label">Total Seats *</label>
                <input type="number" min={1} max={500} className={`input ${errors.totalSeats ? 'input-error' : ''}`}
                  placeholder="e.g. 12"
                  {...register('totalSeats', { required: 'Total seats required', min: { value: 1, message: 'At least 1 seat' } })} />
                {errors.totalSeats && <span className="field-error">{errors.totalSeats.message}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Cost Per Person (USD)</label>
                <input type="number" min={0} className="input" placeholder="0 for free"
                  {...register('costPerPerson')} />
              </div>

              <div className="input-group">
                <label className="input-label">Max Altitude (m)</label>
                <input type="number" className="input" placeholder="e.g. 5364"
                  {...register('elevation.maxAlt')} />
              </div>

              <div className="input-group">
                <label className="input-label">Elevation Gain (m)</label>
                <input type="number" className="input" placeholder="e.g. 4000"
                  {...register('elevation.gain')} />
              </div>

              <div className="input-group">
                <label className="input-label">Distance (km)</label>
                <input type="number" className="input" placeholder="e.g. 130"
                  {...register('distance')} />
              </div>
            </div>

            {difficulty === 'extreme' && (
              <div className="warning-box" style={{ marginTop: '1rem' }}>
                <AlertTriangle size={18} /> <strong>Extreme difficulty</strong> — Make sure to clearly communicate requirements and risks to participants.
              </div>
            )}
          </div>

          {/* Equipment */}
          <div className="form-section card">
            <h2 className="form-section-title">🎒 Required Equipment</h2>
            <div className="equip-input-row">
              <input className="input" placeholder="Add equipment item…"
                value={equipInput} onChange={e => setEquipInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEquipment(); } }} />
              <button type="button" className="btn btn-primary" onClick={addEquipment}><Plus size={16} /> Add</button>
            </div>
            <div className="equip-tags">
              {equipment.map((e, i) => (
                <span key={i} className="equip-tag">
                  {e}
                  <button type="button" onClick={() => setEquipment(eq => eq.filter((_, j) => j !== i))}><X size={12} /></button>
                </span>
              ))}
              {equipment.length === 0 && <p className="equip-empty">No equipment added yet</p>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Creating Trek…' : '🏔 Create Trek'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
