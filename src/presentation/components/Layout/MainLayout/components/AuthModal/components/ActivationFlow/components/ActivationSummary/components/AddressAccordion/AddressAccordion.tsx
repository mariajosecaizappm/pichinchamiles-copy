import React, {FC, useState, useEffect} from 'react';
import {Member} from "@/domain/entity/Member/member";
import {Accordion, AccordionItem} from "@heroui/react";
import {useScreenReader} from "@/presentation/components/providers/ScreenReaderProvider";

type AddressAccordionProps = {
    className?: string
    member: Member
}

const AddressAccordion: FC<AddressAccordionProps> = ({member, className}) => {
    const { info } = useScreenReader()
    const [isExpanded, setIsExpanded] = useState(false)

    const handleAccordionChange = (keys: unknown) => {
        const expanded = keys === "1" 
        setIsExpanded(expanded)
    }

    useEffect(() => {
        if (isExpanded) {
            info(`Dirección registrada. Menú expandido. La dirección registrada es: Provincia: ${member.state}. Ciudad: ${member.city}. Dirección: ${member.address}`)
        }
    }, [isExpanded, member, info])

    return (
        <div className={`border border-grayscale-200 rounded-[6px] overflow-hidden ${className || ""}`}>
            <Accordion
                className="p-0"
                onSelectionChange={handleAccordionChange}
                itemClasses={{
                    base: "px-0 w-full",
                    title: "font-sans text-grayscale-500 font-medium text-sm leading-6",
                    trigger: "py-3 px-4 flex items-center cursor-pointer",
                    content: "font-sans text-grayscale-400 text-sm leading-6 flex flex-col gap-4 py-4 px-4 border-t border-grayscale-200",
                    indicator: "text-[#0F265C] transition-transform duration-300 data-[open=true]:rotate-180",
                }}
            >
                <AccordionItem
                    key="1"
                    data-testid="addressAccordion"
                    aria-label="Dirección registrada. Ver la dirección registrada"
                    title="Dirección registrada"
                    indicator={<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7L0 0H10L5 7Z" fill="currentColor"/></svg>}
                >
                    <div className="flex flex-col gap-4">
                        <p>Provincia – {member.state}</p>
                        <p>Ciudad – {member.city}</p>
                        <p>Dirección – {member.address}</p>
                    </div>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default AddressAccordion;