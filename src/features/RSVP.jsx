import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Check, ArrowUpRight } from 'lucide-react';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';

const ATTENDANCE = [
  { value: 'yes',   label: 'Joyfully accepts'    },
  { value: 'maybe', label: 'Maybe'                },
  { value: 'no',    label: 'Regretfully declines' },
];

export function RSVP() {
  const [form, setForm]        = useState({ name: '', attendance: 'yes', guests: '2', message: '' });
  const [submitted, setSubmit] = useState(false);
  const [errors, setErrors]    = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmit(true);
  };

  return (
    <section
      className="rsvp section-pad"
      id="rsvp"
      aria-labelledby="rsvp-heading"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <AmbientCanvas mode="particles" opacity={0.45} />
      <span className="rsvp-deco rsvp-deco--left" aria-hidden="true">❧</span>
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
              <strong>17 February 2027</strong>
              <small>Bangalore, India</small>
            </span>
          </div>
          <div className="signature">Can't wait to see you!</div>
        </motion.div>

        {/* Form */}
        <motion.div
          className="rsvp-form-wrap"
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        >
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
                >
                  <Check size={22} />
                </motion.div>
                <h3>Thank you, {form.name || 'dear friend'}!</h3>
                <p>Your response has been captured. Connect a backend API to store real RSVPs.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => { setSubmit(false); setForm({ name: '', attendance: 'yes', guests: '2', message: '' }); }}
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
                        <input type="radio" name="attendance" value={value} checked={form.attendance === value} onChange={() => setForm(f => ({ ...f, attendance: value }))} />
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

                <button type="submit" className="btn btn-primary submit-btn">
                  Send RSVP <ArrowUpRight size={15} aria-hidden="true" />
                </button>
                <p className="privacy-note">Demo only — responses are not sent to a backend.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default RSVP;
