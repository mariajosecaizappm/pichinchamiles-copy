import React, { FC } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import IconChevronDown from "@/presentation/components/icons/IconChevronDown";

const OtpFormAccordion: FC = () => {

    return (
        <Accordion
            className="w-full px-0 mt-4"
            showDivider={false}
            itemClasses={{
                base: "w-full",
                titleWrapper: "flex-none",
                title: "text-information-500 !typo-main-caption-medium text-center cursor-pointer",
                trigger: "py-0 flex items-center !justify-center gap-2",
                indicator: "text-information-500 font-bold text-xl transition-transform duration-300 data-[open=true]:rotate-180",
                content: "pt-4 pb-0",
            }}
        >
            <AccordionItem
                key="1"
                aria-label="¿No recibiste el código de seguridad?"
                title="¿No recibiste el código de seguridad?"
                indicator={<IconChevronDown />}
            >
                <div className="bg-darkGrayishBlue-100 border border-darkGrayishBlue-300 rounded-lg p-4 typo-main-legal-medium text-left" aria-label="En caso de no recibir el código actualiza tus datos de contacto llamando al uno ochocientos B P M I L E, dos siete seis cuatro cinco tres.">
                    En caso de no recibir el código necesitas actualizar tus datos de contacto comunícate al{" "}
                    <span className="text-information-500 font-medium">
                        1800 - BPMILE (276-453)
                    </span>
                </div>
            </AccordionItem>
        </Accordion>
    );
};

export default OtpFormAccordion;
