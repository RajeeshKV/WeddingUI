import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Check, ArrowUpRight, Lock } from 'lucide-react';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';
import { submitRsvp } from '../services/api/public.js';

const ATTENDANCE = [
  { value: 'Attending',    label: 'Joyfully accepts'    },
  { value: 'Maybe',        label: 'Maybe'               },
  { value: 'NotAttending', label: 'Regretfully declines' },
];

export function RSVP({ weddingConfig = null }) {
  const rsvpEnabled = weddingConfig ? weddingConfig.rsvpEnabled : true; // default open in demo
  const hasSlug     = Boolean(import.meta.env.VITE_WEDDING_SLUG);

  const [form, setForm]        = useState({ name: '', email: '', phone: '', attendance: 'Attending', guests: '2', message: '' });
  const [submitted, setSubmit] = useState(false);
  const [loading,   setLoading]= useState(false);
  const [errors,    setErrors] = useState({});
  const [apiError,  setApiErr] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiErr('');
    setLoading(true);
    try {
      if (hasSlug) {
        await submitRsvp({
          guestName:  form.name,
          email:      form.email   || undefined,
          phone:      form.phone   || undefined,
          status:     form.attendance,
          guestCount: Number(form.guests),
          message:    form.message || undefined,
        });
      }
      setSubmit(true);
    } catch (err) {
      setApiErr(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="rsvp section-pad"
      id="rsvp"
      aria-labelledby="rsvp-heading"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <AmbientCanvas mode="particles" opacity={0.45} />
      <span className="rsvp-deco rsvp-deco--left"  aria-hidden="true">❧</span>
      <span className="rsvp-deco rsvp-deco--right" aria-hidden="true">❧</span>

      <div className="rsvp-layout" style={{ position: 'relative', zIndex: 1 }}>
        {/* Copy */}
        <motion.div
          className="rsvp-copy"
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="eyebrow">KINDLY RESPOND</span>
          <h2 id="rsvp-heading">
            Will you be<br /><em>there with us?</em>
          </h2>
          <p>Your presence would mean the world to us. Let us know if you can join the celebration.</p>
          <div className="rsvp-date">
            <CalendarDays size={18} aria-hidden="true" />
            <span>
              <strong>
                {weddingConfig?.eventDateUtc
                  ? new Date(weddingConfig.eventDateUtc).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                  : '17 February 2027'}
              </strong>
              <small>{weddingConfig?.venue || 'Bangalore, India'}</small>
            </span>
          </div>
          <div className="signature">Can't wait to see you!</div>
        </motion.div>

        {/* Form / disabled state */}
        <motion.div
          className="rsvp-form-wrap"
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* RSVP disabled by admin */}
          {!rsvpEnabled ? (
            <div className="rsvp-success" style={{ padding: '40px 20px' }}>
              <div className="success-icon" aria-hidden="true"><Lock size={22} /></div>
              <h3>RSVPs are closed</h3>
              <p>The couple has closed RSVPs for this event. Please reach out to them directly.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="rsvp-success"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                >
                  <motion.div
                    className="success-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 220, damping: 16 }}
                    aria-hidden="true"
                  ><Check size={22} /></motion.div>
                  <h3>Thank you, {form.name}!</h3>
                  <p>Your RSVP has been received. We can't wait to celebrate with you.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => { setSubmit(false); setForm({ name: '', email: '', phone: '', attendance: 'Attending', guests: '2', message: '' }); }}
                  >
                    Edit response
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="rsvp-form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  aria-label="Wedding RSVP form"
                >
                  <h3>Kindly reply</h3>
                  <p className="form-note">Please respond by 1 February 2027.</p>

                  <fieldset>
                    <legend>Will you be attending?</legend>
                    <div className="radio-row">
                      {ATTENDANCE.map(({ value, label }) => (
                        <label key={value} className={`radio-opt${form.attendance === value ? ' radio-opt--active' : ''}`}>
                          <input type="radio" name="attendance" value={value}
                            checked={form.attendance === value}
                            onChange={() => setForm(f => ({ ...f, attendance: value }))} />
                          <span className="radio-dot" aria-hidden="true" />
                          {label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label className="field-label">
                    Your name <span aria-hidden="true">*</span>
                    <input type="text" required value={form.name} placeholder="Enter your full name"
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      aria-required="true" aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined} />
                    {errors.name && <span id="name-error" className="field-error" role="alert">{errors.name}</span>}
                  </label>

                  <label className="field-label">
                    Email <span className="field-optional">(optional)</span>
                    <input type="email" value={form.email} placeholder="your@email.com"
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </label>

                  <label className="field-label">
                    Phone <span className="field-optional">(optional)</span>
                    <input type="tel" value={form.phone} placeholder="+91XXXXXXXXXX"
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </label>

                  <label className="field-label">
                    Number of guests
                    <select value={form.guests} onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}>
                      {['1','2','3','4'].map(n => <option key={n} value={n}>{n} guest{n !== '1' ? 's' : ''}</option>)}
                    </select>
                  </label>

                  <label className="field-label">
                    A little note <span className="field-optional">(optional)</span>
                    <textarea rows={3} value={form.message} placeholder="Send us your wishes…"
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </label>

                  {apiError && (
                    <p className="field-error" role="alert" style={{ marginTop: 8 }}>{apiError}</p>
                  )}

                  <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                    {loading ? 'Sending…' : <>Send RSVP <ArrowUpRight size={15} aria-hidden="true" /></>}
                  </button>

                  {!hasSlug && (
                    <p className="privacy-note">Demo mode — set VITE_WEDDING_SLUG to connect to the backend.</p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default RSVP;
