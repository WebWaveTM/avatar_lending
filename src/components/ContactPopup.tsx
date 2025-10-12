'use client'

import ContactForm from "./ContactForm/ContactForm";
import { useContactPopup } from "@/context/ContactPopupContext";

export default function ContactPopup() {
    const { showContactPopup, setShowContactPopup } = useContactPopup();

    if (!showContactPopup) return null;

    return <div className="contact-popup-overlay" onClick={() => setShowContactPopup(false)}>
    <div className="contact-popup" onClick={e => e.stopPropagation()}>
      <button className="contact-popup-close" onClick={() => setShowContactPopup(false)}>&times;</button>
      <ContactForm />
    </div>
  </div>
}