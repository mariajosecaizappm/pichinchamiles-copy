import { CreditCardIcon, GiftIcon, TransactionIcon } from "./Icons";

type HowPMEWorksItem = {
    icon: React.ReactNode;
    title: string;
    description: string;
};
export const items: HowPMEWorksItem[] = [
    {
        title: "Usa tu tarjeta de crédito",
        description:
            "Cada compra suma millas automáticamente, recibes hasta 1 milla por cada dólar gastado.",
        icon: <CreditCardIcon />,
    },
    {
        title: "Elige tu recompensa",
        description:
            "Canjea tus millas por productos, vuelos, experiencias y mucho más.",
        icon: (
            <GiftIcon />
        ),
    },
    {
        title: "Canjea como prefieras",
        description:
            "Solo con millas o combina millas + pago con tarjeta de crédito o débito.",
        icon: <TransactionIcon />,
    },
];