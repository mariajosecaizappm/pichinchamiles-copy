import { FlightLocation, TravelLocationType } from "@/domain/entity/TravelLocation";
import { getString, isRecord } from "../commonAdapters";

export const getFlightLocationsAdapter = (hitValue: unknown): FlightLocation => {
    const record = isRecord(hitValue) ? hitValue : {};
    return {
        id: getString(record.id),
        code: getString(record.code),
        description: getString(record.description),
        name: getString(record.name),
        type: getString(record.type) as TravelLocationType,
        countryCode: getString(record.countryCode),
    };
};
