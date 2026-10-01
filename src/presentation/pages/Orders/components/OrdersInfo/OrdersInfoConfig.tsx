import { Icon } from "@iconify/react";
import IconAlert from "@/presentation/components/icons/IconAlert";
import IconCar2 from "@/presentation/components/icons/IconCar2";
import IconWarranty from "@/presentation/components/icons/IconWarranty";
import Link from "next/link";
import links from "@/presentation/config/links";

export const ordersInfo: { id: string, icon: React.ReactNode, text: string | React.ReactNode }[] = [
    {
        id: "max-days",
        icon: (
            <IconCar2 width="56" height="56" />
        ),
        text: (
            <span>
                Tu entrega llegará en un máximo de <span className="font-semibold">7 días hábiles.</span>
            </span>
        ),
    },
    {
        id: "report-duration",
        icon: (
            <IconAlert />
        ),
        text: (
            <span>
                Si recibes un producto con daños, repórtalo en las primeras <span className="font-semibold">48 horas</span> posteriores a la entrega.
            </span>
        ),
    },
    {
        id: "warranty",
        icon: (
            <IconWarranty />
        ),
        text: "La garantía depende de cada proveedor y está sujeta a revisión.",
    },
    {
        id: "more-information",
        icon: (
            <Icon icon="ic:outline-info" width="32" height="32" />
        ),
        text: (
            <span>Para más información sobre garantías de productos comunícate a <span className="font-semibold">1800 - BPMILE (276453)</span>, o consulta los términos y condiciones <span className="text-information-500 hover:underline underline-offset-2   "><Link href={links.termsAndConditions}>aquí</Link></span>.</span>
        )
    }
]
