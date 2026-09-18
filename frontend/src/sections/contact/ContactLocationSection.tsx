import {ArrowRight,MapPin,Navigation} from 'lucide-react';
import {contactLocation} from '../../data/contactLocation';

export default function ContactLocationSection() {
  return (
    <section className="contact-location-section">
      <div className="contact-location-container">
        <div className="contact-location-card">
          <div className="contact-location-content">
            <div className="contact-location-heading">
              <div className="contact-location-kicker">
                <span className="contact-location-kicker-line" />
              </div>
              <h2>Find Us Here</h2>

              <p>
                Visit our office at No 02, Dr Milina Sumathipala Mawatha,
                Colombo 10, Sri Lanka. We look forward to welcoming you.
              </p>
            </div>

            <div className="contact-location-address">
              <div className="contact-location-address-icon">
                <MapPin size={19} strokeWidth={1.8} />
              </div>

              <address>
                No 02, Dr Milina Sumathipala Mawatha,
                <br />
                Colombo 10, Sri Lanka
              </address>
            </div>

            <a
              href={contactLocation.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-location-directions"
            >
              <span>Get Directions</span>

              <span className="contact-location-directions-icon">
                <ArrowRight size={17} strokeWidth={1.9} />
              </span>
            </a>
          </div>

          <div className="contact-location-map-wrapper">
            <div className="contact-location-map-top">
              <div>
                <span>Sumathi Universal (Pvt) Ltd</span>
                <small>Colombo 10, Sri Lanka</small>
              </div>

              <a
                href={contactLocation.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open location in Google Maps"
              >
                <Navigation size={17} strokeWidth={1.8} />
              </a>
            </div>

            <iframe
              src={contactLocation.mapEmbed}
              title="Sumathi Universal office location"
              className="contact-location-map"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
