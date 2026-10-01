"use client"

import { Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

const OrderNotice = () => {
    return (
        <div className="border border-darkGrayishBlue-400 rounded-lg p-4 space-y-2">
            <div className="flex items-center text-blue-500 gap-4">
                <Icon icon="mdi:truck-outline" width={28} />
                <h3 className="font-semibold text-xl">Para tu pedido ten en cuenta:</h3>
            </div>
            <div className="py-2">
                <Divider className="bg-darkGrayishBlue-400"/>
            </div>
            <ul className="list-disc list-inside text-base pl-3">
                <li className="leading-6">Entrega en un máximo de 7 días hábiles.</li>
                <li className="leading-6">La garantía depende de cada proveedor y está sujeta a revisión.</li>
                <li className="leading-6">Los reclamos deben realizarse hasta 48 horas hábiles al <a href="tel:1800276453" className="underline">1800 - BPMILE (276453)</a>.</li>
            </ul>
        </div>
    );
};

export default OrderNotice;
