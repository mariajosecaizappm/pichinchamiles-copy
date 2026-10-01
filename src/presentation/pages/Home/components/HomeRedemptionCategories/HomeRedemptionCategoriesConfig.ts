const PRODUCTS_CTA = "Ver productos";
const DEFAULT_CTA = "Reserva ahora";

/**
 * CTA texts for redemption categories are owned by Frontend.
 * Backoffice "Texto CTA" (linkText) must not be used for this section.
 */
export const getRedemptionCategoryCta = (title: string): string => {
    const normalizedTitle = title.trim().toLowerCase();

    if (normalizedTitle === "productos") {
        return PRODUCTS_CTA;
    }

    return DEFAULT_CTA;
};
