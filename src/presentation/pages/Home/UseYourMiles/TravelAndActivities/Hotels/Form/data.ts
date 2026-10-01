import { buildPassengerCategories as buildPassengerCategoriesUtil } from "../../Form/components/PassengerSelect/utils";
import { PassengerConfig } from "../../Form/components/PassengerSelect/types";

export const maxPassengers = 8;
export const maxAdultsPassengers = 4;
export const maxChildrenPassegengers = 4;
export const maxInfantsPassengers = 0;

export const hotelsPassengerConfig: PassengerConfig = {
    maxPassengers,
    maxAdultsPassengers,
    maxChildrenPassegengers,
    maxInfantsPassengers,
    adultsLabel: "Adultos (18+)",
    childrensLabel: "Menores (0-17)",
    infantsLabel: "Bebés (0-2)"
};

export const buildPassengerCategories = (
    adults: number,
    childrens: number,
    infants: number
) => buildPassengerCategoriesUtil(adults, childrens, infants, hotelsPassengerConfig);
