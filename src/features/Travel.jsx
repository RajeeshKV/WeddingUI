import React from 'react';
import { MapPin, Clock3, ArrowUpRight } from 'lucide-react';

const venueImg = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85';

const S = (w) => ({
  display: 'inline-block', width: w, height: '0.85em',
  background: 'linear-gradient(90deg,#E4DDD4 25%,#D4CCCA 50%,#E4DDD4 75%)',
  backgroundSize: '200% 100%',
  animation: 'travelSkel 1.5s ease-in-out infinite',
  borderRadius: 3, verticalAlign: 'middle',
});

export function Travel({ weddingConfig = null, loading = false }) {
  const hasConfig = !loading && weddingConfig;

  const venue    = hasConfig?.venue || null;
  const dateStr  = hasConfig?.eventDateUtc
    ? new Date(hasConfig.eventDateUtc).toLocaleDateString('en-IN', { day:'numeric', month:'long' })
      + ' · ' + new Date(hasConfig.eventDateUtc).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true })
      + ' onwards'
    : null;

  const mapsHref = venue
    ? `https://maps.google.com/?q=${encodeURIComponent(venue)}`
    : 'https://maps.google.com/';

  return (
    <section className="travel section-pad" id="travel" aria-labelledby="travel-heading">
      <div className="travel-card">
        <div className="travel-text">
          <span className="eyebrow">A LITTLE HELP GETTING HERE</span>
          <h2 id="travel-heading">Find your <em>way to us.</em></h2>
          <p>
            We cannot wait to welcome you. Save the venue details and give
            yourself a little extra time to arrive.
          </p>

          <div className="travel-detail">
            <MapPin size={16} aria-hidden="true" />
            <span>
              <strong>{loading ? <span style={S(140)} /> : venue}</strong>
              {!loading && venue && <small>{venue}</small>}
            </span>
          </div>

          <div className="travel-detail">
            <Clock3 size={16} aria-hidden="true" />
            <span>
              <strong>Wedding ceremony</strong>
              <small>{loading ? <span style={S(160)} /> : dateStr}</small>
            </span>
          </div>

          {!loading && (
            <a
              className="btn btn-primary travel-map-btn"
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              aria-label={venue ? `Open ${venue} in Google Maps` : 'Open in Google Maps'}
            >
              Open in Maps <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="travel-img-wrap">
          <img src={venueImg} alt="Wedding venue" loading="lazy" />
          <div className="travel-img-caption" aria-hidden="true">
            <span>THE DESTINATION</span>
            <strong>Where our forever begins.</strong>
          </div>
        </div>
      </div>
      <style>{`@keyframes travelSkel{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </section>
  );
}

export default Travel;
