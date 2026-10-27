import React from 'react';
import { MapPin, Clock3, ArrowUpRight } from 'lucide-react';

const venueImg = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85';

export function Travel({ weddingConfig = null }) {
  const venue   = weddingConfig?.venue || 'The Grand Pavilion';
  const address = weddingConfig?.venue
    ? weddingConfig.venue
    : 'Outer Ring Road, Bangalore, Karnataka';
  const dateStr = weddingConfig?.eventDateUtc
    ? new Date(weddingConfig.eventDateUtc).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long',
      }) + ' · ' + new Date(weddingConfig.eventDateUtc).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true,
      }) + ' onwards'
    : '17 February · 7:00 AM onwards';

  const mapsQuery = encodeURIComponent(venue + (address ? ', ' + address : ''));

  return (
    <section className="travel section-pad" id="travel" aria-labelledby="travel-heading">
      <div className="travel-card">
        {/* Text */}
        <div className="travel-text">
          <span className="eyebrow">A LITTLE HELP GETTING HERE</span>
          <h2 id="travel-heading">Find your <em>way to us.</em></h2>
          <p>
            We can't wait to welcome you. Save the venue details and give
            yourself a little extra time to arrive.
          </p>

          <div className="travel-detail">
            <MapPin size={16} aria-hidden="true" />
            <span>
              <strong>{venue}</strong>
              <small>{address}</small>
            </span>
          </div>

          <div className="travel-detail">
            <Clock3 size={16} aria-hidden="true" />
            <span>
              <strong>Wedding ceremony</strong>
              <small>{dateStr}</small>
            </span>
          </div>

          <a
            className="btn btn-primary travel-map-btn"
            href={`https://maps.google.com/?q=${mapsQuery}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${venue} in Google Maps`}
          >
            Open in Maps <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>

        {/* Image */}
        <div className="travel-img-wrap">
          <img src={venueImg} alt="Wedding venue" loading="lazy" />
          <div className="travel-img-caption" aria-hidden="true">
            <span>THE DESTINATION</span>
            <strong>Where our forever begins.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Travel;
