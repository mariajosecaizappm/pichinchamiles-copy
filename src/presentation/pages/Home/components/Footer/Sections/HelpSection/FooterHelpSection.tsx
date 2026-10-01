"use client"

import links from "@/presentation/config/links";
import AppLink from "@/presentation/components/AppLink";
import PhoneIcon from "../../Icons/PhoneIcon";
import { Divider } from "@heroui/react";
import useContactLinkGuard from "@/presentation/hooks/useContactLinkGuard";

const FooterHelpSection = () => {
    const handleContactClick = useContactLinkGuard();
    return (
        <section className="flex flex-col gap-6 w-full" aria-labelledby="footer-help-title">
            <h3 id="footer-help-title" className="font-semibold text-lg md:text-xl">Ayuda</h3>
            <ul className="space-y-2">
                <li>
                    <AppLink href={links.contact} onClick={(e) => handleContactClick(e, links.contact)}>Contacto</AppLink>
                </li>
                <li>
                    <AppLink href={links.faq}>Preguntas frecuentes</AppLink>
                </li>
            </ul>
            <div className="flex flex-col gap-4">
                <button
                    className="flex justify-center items-center gap-2 h-10 px-2 py-4 rounded-sm bg-white border border-blue-500 text-blue-500 cursor-pointer"
                    aria-label="Llamar al teléfono de atención al cliente: 1800 - BPMILE (276453)"
                >
                    <PhoneIcon />
                    <p className="text-sm font-semibold">
                        Llámanos al 1800 - BPMILE (276453)
                    </p>
                </button>
                <span className="py-2 md:hidden">
                    <Divider />
                </span>
            </div>
        </section>
    )
};

export default FooterHelpSection;
