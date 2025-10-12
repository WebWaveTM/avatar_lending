'use client'

import { useContactPopup } from "@/context/ContactPopupContext";
import { PropsWithChildren } from "react";


export default function ContactPopupBtn({children}: PropsWithChildren) {
    const { setShowContactPopup } = useContactPopup();

    return (
        <button className="ruby-button contact-button" onClick={() => setShowContactPopup(true)}>
            {children}
        </button>
    )
}