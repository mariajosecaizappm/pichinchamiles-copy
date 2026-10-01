import { Divider } from "@heroui/react";
import Image from "next/image";
import AccordionLinks from "./AccordionLinks";
import { FOOTER_ITEMS } from "./FooterConfig";
import AppLink from "@/presentation/components/AppLink";
import FooterHelpSection from "./Sections/HelpSection";


const Footer = () => {
    return (
        <footer className=" p-6 items-start bg-darkGrayishBlue-100">
            <div className="w-full md:max-w-[1228px] mx-auto flex flex-col gap-6 ">
                <div className="py-4 w-full max-w-60">
                    <AppLink href="/" aria-label="Pichincha Miles - Inicio">
                        <Image
                            src={"/pm-logo.svg"}
                            alt="Pichincha Miles Logo"
                            aria-hidden='true'
                            className="h-full w-full object-contain"
                            width={1000}
                            height={400}
                            priority
                        />
                    </AppLink>
                </div>
                <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8 w-full">
                    <FooterHelpSection />
                    <div className="w-full md:col-span-2">
                        <nav className="flex flex-col gap-4 md:hidden" aria-label="Enlaces del pie de página">
                            <AccordionLinks />
                        </nav>
                        <nav className="hidden md:grid grid-cols-2 gap-8" aria-label="Enlaces del pie de página">
                            {FOOTER_ITEMS.map((item) => (
                                <section key={item.title} className="flex flex-col gap-6">
                                    <h4 id={`footer-${item.title.toLowerCase().replaceAll(' ', '-')}`} className="font-semibold text-xl">{item.title}</h4>
                                    <ul className="flex flex-col gap-4">
                                        {item.links.map((link) => (
                                            <li key={link.href} className="text-base">
                                                <AppLink href={link.href}>{link.label}</AppLink>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ))}
                        </nav>
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <Divider />
                    <p className="text-xs text-neutral-700 text-center">
                        El programa de recompensas Pichincha Miles® es gestionado y
                        administrado por la empresa Publipromueve S.A.
                    </p>
                </div>
            </div>
        </footer>
    );
};






export default Footer;
