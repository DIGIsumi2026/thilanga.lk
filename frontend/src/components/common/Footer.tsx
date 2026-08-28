import { Link } from "react-router-dom";
import { MapPin, Phone, Scale } from "lucide-react";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cta">
        <h3>
          Contact us today for a <em>free case evaluation?</em>
        </h3>
        <Link className="pill white" to="/contact">
          Free consultation <span>→</span>
        </Link>
      </div>
      <div className="footer-grid">
        <div>
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark">
              <Scale size={18} />
            </span>
            <strong>Lawyer</strong>
          </Link>
          <p>
            Over the years, our commitment to excellence and passion for our
            clients has been recognized.
          </p>
        </div>
        <div>
          <h6>
            <MapPin size={14} /> Landmark
          </h6>
          <p>
            27 Eden eden centre,
            <br />
            Orchard, Paris, France
          </p>
        </div>
        <div>
          <h6>
            <Phone size={14} /> Contact
          </h6>
          <p>
            (123) 456 7890
            <br />
            <u>info@domain.com</u>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <div>{links()}</div>
        <small>
          © 2026 Lawyer recreation. Built from the supplied visual reference.
        </small>
      </div>
    </footer>
  );
}
function links() {
  return (
    <>
      {[
        ["Home", "/"],
        ["About", "/about"],
        ["Practice areas", "/practice-areas"],
        ["Attorneys", "/attorneys"],
        ["Journal", "/journal"],
        ["Contact", "/contact"],
      ].map(([n, p]) => (
        <Link key={p} to={p}>
          {n}
        </Link>
      ))}
    </>
  );
}
