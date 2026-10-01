"use client";

import Alert from "@/presentation/components/Alert";

const SUPPORT_MESSAGE = "Comunícate al 1800 – BPMILE (276453)";

const SupportBox = () => (
    <Alert variant="info">
        <div className="font-sans text-grayscale-500">
            <p className="font-semibold text-[18px] leading-body">
                ¿Necesitas ayuda?
            </p>
            <p className="mt-1 text-sm leading-body font-medium">
                {SUPPORT_MESSAGE}
            </p>
        </div>
    </Alert>
);

export default SupportBox;
