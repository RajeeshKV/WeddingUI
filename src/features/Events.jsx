import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CalendarDays, Heart, Camera, ArrowUpRight } from 'lucide-react';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';

const haldiImg   = 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85';
const sangeetImg = 'https://images.unsplash.com/photo-1519225421980-888cb7e6c7c2?auto=format&fit=crop&w=900&q=85';
const weddingImg = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85';

const EVENTS = [
  { name: 'Haldi',       day: '14', month: 'FEB', time: '9:00 AM – 12:00 PM', place: 'The Grand Pavilion', city: 'Bangalore', img: haldiImg,   desc: 'A morning of sunshine, turmeric and laughter.' },
  { name: 'Sangeet',     day: '15', month: 'FEB', time: '6:00 PM – 11:00 PM', place: 'Royal Orchid Resort', city: 'Bangalore', img: sangeetImg, desc: 'Bring your dancing shoes and your best moves.' },
  { name: 'The Wedding', day: '17', month: 'FEB', time: '7:00 AM – 12:00 PM', place: 'The Grand Pavilion', city: 'Bangalore', img: weddingImg, desc: 'The day we have been dreaming of.' },
];

const QUICK = [
  { Icon: MapPin,       label: 'Venue',      sub: 'Get directions' },
  { Icon: CalendarDays, label: 'Schedule',   sub: 'Plan your day'  },
  { Icon: Heart,        label: 'Dress code', sub: 'Festive formal' },
  { Icon: Camera,       label: 'Memories',   sub: 'Share photos'   },
];

export function Events({ onScrollTo }) {
  return (
    <section
      className="events section-pad"
      id="events"
      aria-labelledby="events-heading"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <AmbientCanvas mode="particles" opacity={0.6} />

      <div className="section-heading" style={{ position: 'relative', zIndex: 1 }}>
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.22em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          SAVE THESE LITTLE MOMENTS
        </motion.span>
        <motion.h2
          id="events-heading"
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
        >
          The wedding <em>weekend.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Come for the ceremonies. Stay for the memories.
        </motion.p>
      </div>

      <div className="event-grid" style={{ position: 'relative', zIndex: 1 }}>
        {EVENTS.map((ev, i) => (
          <motion.article
            key={ev.name}
            className="event-card"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.12, duration: 0.7, type: 'spring', stiffness: 100, damping: 16 }}
            aria-label={`${ev.name} — ${ev.day} ${ev.month}, ${ev.time}`}
          >
            <div className="event-img-wrap">
              <img src={ev.img} alt={`${ev.name} celebration`} loading="lazy" />
              <div className="date-badge" aria-hidden="true">
                <strong>{ev.day}</strong>
                <span>{ev.month}</span>
              </div>
            </div>
            <div className="event-body">
              <span className="eyebrow">{ev.time}</span>
              <h3>{ev.name}</h3>
              <p>{ev.desc}</p>
              <div className="venue-line">
                <MapPin size={14} aria-hidden="true" />
                <span>{ev.place}<small>{ev.city}</small></span>
              </div>
              <button
                className="text-link"
                onClick={() => onScrollTo('travel')}
                aria-label={`Venue details for ${ev.name}`}
              >
                Venue details <ArrowUpRight size={13} aria-hidden="true" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        className="quick-info"
        role="list"
        aria-label="Wedding information"
        style={{ position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {QUICK.map(({ Icon, label, sub }) => (
          <div key={label} className="quick-info-item" role="listitem">
            <Icon size={18} aria-hidden="true" />
            <span><strong>{label}</strong><small>{sub}</small></span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export default Events;
