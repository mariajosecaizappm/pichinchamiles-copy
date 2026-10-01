import links from "@/presentation/config/links";

export type SubMenuItem = {
    label: string;
    href: string;
}

export type MenuItem = {
    label: string;
    href?: string;
    submenus?: SubMenuItem[];
};


const TRAVEL_SUBMENUS: SubMenuItem[] = [
    { label: "Vuelos", href: links.flights },
    { label: "Hoteles", href: links.hotels },
    { label: "Renta de autos", href: links.carRental },
    { label: "Actividades", href: links.activities },
    { label: "Disney", href: links.disney },
];

const HELP_SUBMENUS: SubMenuItem[] = [
    { label: "Preguntas frecuentes", href: links.faq },
    { label: "Contacto", href: links.contact },
];

const PROFILE_SUBMENUS: SubMenuItem[] = [
    { label: "Historial de transacciones", href: links.myTransactions },
    { label: "Información personal", href: links.myInformation },
    { label: "Direcciones", href: links.myAddresses },
    { label: "Seguridad", href: links.mySecurity },
];

const OFFERS_SUBMENUS: SubMenuItem[] = [
    { label: "Productos", href: `${links.offers}/${links.productsList}` },
    { label: "Viajes y actividades", href: `${links.offers}/${links.travelAndActivities}` },
];

const buildGuestNavItems = (productSubmenus: SubMenuItem[]) => [
    { label: "¿Qué es Pichincha Miles?", href: links.home, },
    { label: "Explorar recompensas", href: links.products, },
    { label: "Ofertas", href: links.offers, submenus: OFFERS_SUBMENUS },
    ...(productSubmenus.length > 0 ? [{ label: "Productos", href: links.productsList, submenus: productSubmenus }] : []),
    { label: "Viajes y actividades", href: links.flights, submenus: TRAVEL_SUBMENUS },
    { label: "Ayuda", submenus: HELP_SUBMENUS },
]

const buildAuthenticatedNavItems = (productSubmenus: SubMenuItem[]) => [
    { label: "Explorar recompensas", href: links.products, },
    { label: "Ofertas", href: links.offers, submenus: OFFERS_SUBMENUS },
    { label: "Transferencia de millas", href: links.transferMiles, },
    { label: "Mis pedidos", href: links.myOrders, },
    { label: "Mi perfil", href: links.myProfile, submenus: PROFILE_SUBMENUS },
    ...(productSubmenus.length > 0 ? [{ label: "Productos", href: links.productsList, submenus: productSubmenus }] : []),
    { label: "Viajes y actividades", href: links.flights, submenus: TRAVEL_SUBMENUS },
    { label: "Ayuda", submenus: HELP_SUBMENUS },
]


export const buildNavItems = (productSubmenus: SubMenuItem[], isAuth: boolean) => {
    if (isAuth) {
        return buildAuthenticatedNavItems(productSubmenus)
    }
    return buildGuestNavItems(productSubmenus)
}

