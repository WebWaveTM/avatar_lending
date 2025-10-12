'use client'

import { createContext, PropsWithChildren, useContext, useState } from "react";

type  ContactPopupContextType = {
  showContactPopup: boolean;
  setShowContactPopup: (show: boolean) => void;
}

const ContactPopupContext = createContext<ContactPopupContextType>({
  showContactPopup: false,
  setShowContactPopup: () => {},
});

export function useContactPopup() {
  return useContext(ContactPopupContext);
}

export default function ContactPopupProvider({ children }: PropsWithChildren) {
  const [showContactPopup, setShowContactPopup] = useState(false);

  return (
    <ContactPopupContext.Provider value={{ showContactPopup, setShowContactPopup }}>
      {children}
    </ContactPopupContext.Provider>
  );
};