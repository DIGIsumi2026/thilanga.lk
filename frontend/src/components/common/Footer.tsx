import {Facebook,Linkedin,Mail,MapPin,Phone} from 'lucide-react';
import {Link} from 'react-router-dom';
import {imageAssets} from '../../assets/imageAssets';
import {contactLocation} from '../../data/contactLocation';
import {navbarSocialLinks} from './navbarSocialLinks';

const footerLinks = [
  {label: 'Home', path: '/'},
  {label: 'About Me', path: '/about-me'},
  {label: 'Corporate', path: '/corporate'},
  {label: 'Political', path: '/political'},
  {label: 'Public Relations', path: '/public-relations'},
  {label: 'Contact', path: '/contact'},
] as const;

const socialIcons = [
  {key: 'facebook', label: 'Facebook', icon: <Facebook size={17} strokeWidth={1.6} />},
  {
    key: 'x',
    label: 'X',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.9-9L.8 2h6.5l4.5 6.7L18.9 2ZM17.8 20h1.7L6.2 4H4.4l13.4 16Z" />
      </svg>
    ),
  },
  {key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={17} strokeWidth={1.6} />},
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <section className="footer-brand-column" aria-label="About Thilanga Sumathipala">
            <Link className="footer-logo" to="/" aria-label="Thilanga Sumathipala - Home">
              <img src={imageAssets.brand.logo} alt="Thilanga Sumathipala" />
            </Link>
            <p className="footer-description">
              Thilanga Sumathipala | Chairman, Sumathi Ventures &amp; Asia Capital PLC | Former Sri Lankan MP, Deputy Speaker, and State Minister (2010–2020).
            </p>
            <div className="footer-socials" aria-label="Social links">
              {socialIcons.map(({key, label, icon}) => {
                const href = navbarSocialLinks[key];
                return href ? (
                  <a key={key} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">{icon}</a>
                ) : (
                  <button key={key} type="button" disabled aria-label={`${label} (link unavailable)`}>{icon}</button>
                );
              })}
            </div>
          </section>

          <nav className="footer-links-column" aria-label="Footer navigation">
            <h2 className="footer-heading">Quick Links</h2>
            <div className="footer-links-list">
              {footerLinks.map(({label, path}) => (
                <Link key={path} to={path}><span aria-hidden="true" />{label}</Link>
              ))}
            </div>
          </nav>

          <section className="footer-contact-column">
            <h2 className="footer-heading">Contact</h2>
            <div className="footer-contact-list">
              <div className="footer-contact-row">
                <MapPin size={17} strokeWidth={1.7} aria-hidden="true" />
                <address>No 02, Dr Milina Sumathipala Mawatha,<br />Colombo 10, Sri Lanka</address>
              </div>
              <div className="footer-contact-row">
                <Mail size={17} strokeWidth={1.7} aria-hidden="true" />
                <a href="mailto:info@thilangasumathipala.lk">info@thilangasumathipala.lk</a>
              </div>
              <div className="footer-contact-row footer-phone-row">
                <Phone size={17} strokeWidth={1.7} aria-hidden="true" />
                <div>
                  <a href="tel:+94112697106">(+94) 112 697 106</a>
                  <a href="tel:+94112677260">(+94) 112 677 260</a>
                </div>
              </div>
            </div>
          </section>

          <section className="footer-map-column">
            <h2 className="footer-heading">Location</h2>
            <div className="footer-map-frame">
              <iframe
                src={contactLocation.mapEmbed}
                title="Thilanga Sumathipala office location"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <a className="footer-map-link" href={contactLocation.mapLink} target="_blank" rel="noopener noreferrer">
              Open in Maps <span aria-hidden="true">↗</span>
            </a>
          </section>
        </div>

        <div className="footer-liquid-divider" aria-hidden="true" />
        <div className="footer-bottom">
          <p>Copyright © {currentYear} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
