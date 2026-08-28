import { MessageCircle } from "lucide-react";
export default function FloatingContact() {
  return (
    <a className="floating-contact" href="mailto:info@domain.com">
      <span>Get free consultation</span>
      <i>
        <MessageCircle size={17} />
      </i>
    </a>
  );
}
