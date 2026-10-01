import { Category, PassengerConfig } from "./types";

export const buildPassengerCategories = (
    adults: number,
    childrens: number,
    infants: number,
    config: PassengerConfig
): Category[] => {
    const maxChilds = config.maxPassengers - adults
    const maxInfants = Math.min(adults, config.maxInfantsPassengers);

    const categories: Category[] = [
        {
            key: "adults",
            label: config.adultsLabel,
            min: 1,
            max: config.maxAdultsPassengers,
            value: adults,
            state: "default"
        },
        {
            key: "childrens",
            label: config.childrensLabel,
            min: 0,
            max: Math.min(maxChilds, config.maxChildrenPassegengers),
            value: childrens,
            state: "default"
        },
        {
            key: "infants",
            label: config.infantsLabel,
            min: 0,
            max: maxInfants,
            value: infants,
            state: "default"
        }
    ];

    return categories
};
