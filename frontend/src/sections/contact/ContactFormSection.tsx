import {FormEvent,useState} from 'react';
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import BorderGlow from '../../components/common/BorderGlow';
import { contactButtonGlowProps } from '../../components/common/borderGlowPresets';

const MAX_CHARACTERS = 500;

export default function ContactFormSection() {
  const [message,setMessage] = useState('');
  const remainingCharacters = Math.max(0, MAX_CHARACTERS - message.length);

  const handleMessageChange = (
    event:React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    /*
      Connect this point to the contact API/backend later.
      Do not clear the form until the server confirms submission.
    */
  };

  return (
    <section className="contact-form-section">
      <div className="contact-form-container">
        <div className="contact-form-panel">
          <div className="contact-form-heading">
            <span>Let's Connect</span>

            <h2>
              Send a message
            </h2>

            <p>
              Complete the form below and our team will get back to you
              regarding your inquiry.
            </p>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <div className="contact-form-grid">
              <div className="contact-field">
                <label htmlFor="contact-name">
                  Name
                  <span aria-hidden="true">*</span>
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-subject">
                  Subject
                  <small>Optional</small>
                </label>

                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="Subject"
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">
                  Email
                  <span aria-hidden="true">*</span>
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-phone">
                  Phone
                  <span aria-hidden="true">*</span>
                </label>

                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="+94"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div className="contact-field contact-message-field">
              <div className="contact-message-label">
                <label htmlFor="contact-message">
                  Message
                  <span aria-hidden="true">*</span>
                </label>

                <span
                  className={`contact-word-counter ${
                    remainingCharacters <= 50 ? 'is-near-limit' : ''
                  } ${remainingCharacters === 0 ? 'is-at-limit' : ''}`}
                  aria-live="polite"
                >
                  {remainingCharacters} characters remaining
                </span>
              </div>

              <textarea
                id="contact-message"
                name="message"
                value={message}
                onChange={handleMessageChange}
                placeholder="Write your message here..."
                rows={8}
                maxLength={MAX_CHARACTERS}
                required
              />
            </div>

            <BorderGlow
              className="contact-submit-glow"
              {...contactButtonGlowProps}
            >
              <button
                type="submit"
                className="contact-submit-button"
              >
                <span>Send Message</span>
                <Send size={16} strokeWidth={1.8} />
              </button>
            </BorderGlow>
          </form>
        </div>

        <aside className="contact-details">
          <article className="contact-detail-card">
            <div className="contact-detail-icon">
              <MapPin size={21} strokeWidth={1.7} />
            </div>

            <div>
              <span className="contact-detail-label">
                Visit Us
              </span>

              <h3>Office Address</h3>

              <p>
                No 02, Dr Milina Sumathipala Mawatha,
                Colombo 10, Sri Lanka
              </p>
            </div>
          </article>

          <article className="contact-detail-card">
            <div className="contact-detail-icon">
              <Phone size={21} strokeWidth={1.7} />
            </div>

            <div>
              <span className="contact-detail-label">
                Call Us
              </span>

              <h3>Phone</h3>

              <div className="contact-detail-links">
                <a href="tel:+94112697106">
                  <span>(+94) 112 697 106</span>
                  <ArrowUpRight size={15} />
                </a>

                <a href="tel:+94112677260">
                  <span>(+94) 112 677 260</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </article>

          <article className="contact-detail-card">
            <div className="contact-detail-icon">
              <Mail size={21} strokeWidth={1.7} />
            </div>

            <div>
              <span className="contact-detail-label">
                Email Us
              </span>

              <h3>Email</h3>

              <div className="contact-detail-links">
                <a href="mailto:info@thilangasumathipala.lk">
                  <span>info@thilangasumathipala.lk</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}