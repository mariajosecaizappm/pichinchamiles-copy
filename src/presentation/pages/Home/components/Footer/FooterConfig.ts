import links from "@/presentation/config/links";

export type FooterItem = {
    title: string;
    links: { label: string; href: string }[];
};

export const FOOTER_ITEMS: FooterItem[] = [
    {
        title: "Utiliza tus millas",
        links: [
            { label: "Productos", href: links.products },
            { label: "Viajes y Actividades", href: "/utilice-sus-millas/viajes-y-actividades" },
        ],
    },
    {
        title: "Condiciones legales",
        links: [
            { label: "Alertas de seguridad", href: "/alertas-de-seguridad" },
            { label: "Políticas de privacidad en internet", href: "/politicas-de-privacidad" },
            { label: "Términos y condiciones del programa", href: "/terminos-condiciones-del-programa" },
            { label: "Términos y condiciones de uso", href: "/terminos-condiciones-de-uso" },
            { label: "Aviso de política de privacidad", href: "https://www.pichincha.com/sites/default/files/documents/2025-09/aviso-de-privacidad-canales-electronicos.pdf" },
            { label: "Política de cookies", href: "/politica-de-cookies" },
        ],
    },
];