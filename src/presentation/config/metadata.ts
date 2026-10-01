import type { Metadata } from "next"

const SITE_NAME = "Pichincha Miles"

const defaultDescription =
    "Es el programa de recompensas de Banco Pichincha que te permite acumular millas con tus tarjetas Visa y MasterCards"

export const createPageMetadata = (
    title: string,
    description: string = defaultDescription,
): Metadata => ({
    title,
    description,
})

const pageMetadata = Object.freeze({
    siteName: SITE_NAME,
    defaultDescription,
    home: {
        title: {
            absolute: SITE_NAME,
        },
        description: defaultDescription,
    },
    ofertasViajesYActividades: createPageMetadata(
        "Ofertas Viajes y Actividades",
        "Canjea tus millas por fantásticos destinos y cambia tu rutina por diferentes actividades.",
    ),
    ofertasProductos: createPageMetadata(
        "Ofertas Productos",
        "Descubre los mejores productos para el hogar, mascotas, juguetería, tecnología y mucho más",
    ),
    productos: createPageMetadata(
        "Productos",
        "Descubre los mejores productos para el hogar, mascotas, juguetería, tecnología y mucho más",
    ),
    viajesYActividades: createPageMetadata(
        "Viajes y Actividades",
        "Canjea tus millas por fantásticos destinos y cambia tu rutina por diferentes actividades.",
    ),
    vuelos: createPageMetadata(
        "Vuelos",
        "Canjea tus millas por fantásticos destinos y cambia tu rutina por diferentes actividades.",
    ),
    hoteles: createPageMetadata("Hoteles"),
    autos: createPageMetadata("Autos"),
    actividades: createPageMetadata("Actividades"),
    disney: createPageMetadata("Disney"),
    carrito: createPageMetadata("Carrito de compra"),
    miPerfil: createPageMetadata("Mi perfil"),
    informacion: createPageMetadata("Mi información"),
    direcciones: createPageMetadata("Mis direcciones"),
    seguridad: createPageMetadata("Seguridad"),
    transacciones: createPageMetadata("Transacciones"),
    terminosPrograma: createPageMetadata("Términos y condiciones del programa"),
    terminosUso: createPageMetadata("Términos y condiciones de uso"),
    politicasPrivacidad: createPageMetadata("Políticas de privacidad"),
    politicaCookies: createPageMetadata("Política de cookies"),
    alertasSeguridad: createPageMetadata("Alertas de seguridad"),
    notFound: createPageMetadata("No existe esta página"),
})

export default pageMetadata
