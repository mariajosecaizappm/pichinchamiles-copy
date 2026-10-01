"use server"

import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetFlightLocationsUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetFlightsLocationsUseCase";
import { FlightLocation } from "@/domain/entity/TravelLocation";

export async function searchLocations(search: string) {
    const getFlightsLocations = container.get<GetFlightLocationsUseCase>(
        UseCaseTypes.GetFlightLocationsUseCase,
    );

    const locations = await getFlightsLocations.execute(search);

    return locations.map((location: FlightLocation) => ({
        id: location.code,
        name: location.description,
        countryCode: location.countryCode,
    }));
}