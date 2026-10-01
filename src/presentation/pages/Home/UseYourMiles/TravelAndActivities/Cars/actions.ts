"use server"

import { CarRentalLocation } from "@/domain/entity/TravelLocation";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetCarRentalLocationsUseCase from "@/domain/interactors/TravelLocation/GetCarRentalLocationsUseCase";
import container from "@/presentation/config/inversify.config";

export async function searchLocations(search: string) {
    const getCarRentalLocations = container.get<GetCarRentalLocationsUseCase>(
        UseCaseTypes.GetCarRentalLocationsUseCase,
    );

    const locations = await getCarRentalLocations.execute(search);

    return locations.map(
        ({ code, cityName, countryName, name }: CarRentalLocation) => {
            const formatName = name ? `${name} - ` : '';
            const formatCity = cityName ? `${cityName} - ` : '';
            const formatCountry = countryName ? `${countryName}` : '';
            const formatCode = code ? ` (${code ?? ''})` : '';

            return {
                id: code ?? '',
                name: formatCity + formatName + formatCountry + formatCode,
            };
        },
    );
}