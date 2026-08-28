import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";
export default function ContactForm() {
  const ref = useAnimeReveal<HTMLElement>();
  const [status, setStatus] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending…");
    const form = new FormData(e.currentTarget);
    try {
      const r = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      if (!r.ok) throw new Error();
      setStatus("Message sent successfully.");
      e.currentTarget.reset();
    } catch {
      setStatus("Backend is not running. Start backend on port 4000.");
    }
  }
  return (
    <section className="section contact-section" ref={ref} data-reveal-group>
      <div className="contact-copy" data-reveal>
        <span className="mini-kicker gold">Get in touch with us</span>
        <h2>
          Do you need help?
          <br />
          <em>Contact with us now!</em>
        </h2>
        <div className="contact-line">
          <MapPin />
          <p>
            <b>Are you ready for coffee?</b>
            <br />
            401 Broadway, 24th Floor, Orchard View, London
          </p>
        </div>
        <div className="contact-line">
          <Phone />
          <p>
            <b>Feel free to get in touch?</b>
            <br />
            Phone: 1-800-222-000 · Fax: 1-800-222-002
          </p>
        </div>
        <div className="contact-line">
          <Mail />
          <p>
            <b>How can we help you?</b>
            <br />
            info@domain.com
          </p>
        </div>
      </div>
      <form data-reveal onSubmit={submit}>
        <h2>
          Say <em>hello!</em>
        </h2>
        <input name="name" placeholder="Enter your name*" required />
        <input
          name="email"
          type="email"
          placeholder="Enter your email*"
          required
        />
        <textarea
          name="message"
          placeholder="Enter your message"
          rows={6}
          required
        />
        <button className="pill white" type="submit">
          Send message <span>→</span>
        </button>
        <small>
          {status || "Your data is used only to respond to this enquiry."}
        </small>
      </form>
    </section>
  );
}
