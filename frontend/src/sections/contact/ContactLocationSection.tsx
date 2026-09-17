import {ArrowRight,MapPin,Navigation} from 'lucide-react';

const GOOGLE_MAP_LINK =
  'https://maps.app.goo.gl/Q1CvFAK5hoZCL1b2A';

const GOOGLE_MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.73988985588!2d79.87005581009308!3d6.921666518380401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2590b84e25971%3A0x35ebee7d9faae5c0!2sSumathi%20Universal%20(Pvt)%20Ltd!5e0!3m2!1sen!2slk!4v1789640935445!5m2!1sen!2slk';

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
              href={GOOGLE_MAP_LINK}
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
                href={GOOGLE_MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open location in Google Maps"
              >
                <Navigation size={17} strokeWidth={1.8} />
              </a>
            </div>

            <iframe
              src={GOOGLE_MAP_EMBED}
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