import { buildPassengerCategories as buildPassengerCategoriesUtil } from "../../Form/components/PassengerSelect/utils";
import { PassengerConfig } from "../../Form/components/PassengerSelect/types";

export const maxPassengers = 20;
export const maxAdultsPassengers = 10;
export const maxChildrenPassegengers = 10;
export const maxInfantsPassengers = 0;

export const disneyPassengerConfig: PassengerConfig = {
    maxPassengers,
    maxAdultsPassengers,
    maxChildrenPassegengers,
    maxInfantsPassengers,
    adultsLabel: "Adultos (desde 10 años)",
    childrensLabel: "Niños (de 3 a 9 años)",
    infantsLabel: "Bebés (de 0 a 23 meses)"
};

export const buildPassengerCategories = (
    adults: number,
    childrens: number,
    infants: number
) => buildPassengerCategoriesUtil(adults, childrens, infants, disneyPassengerConfig);
