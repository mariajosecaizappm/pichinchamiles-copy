import { HotelLocation, TravelLocationType } from "@/domain/entity/TravelLocation";
import { getString, isRecord } from "../commonAdapters";

export const getHotelLocationsAdapter = (hitValue: unknown): HotelLocation => {
    const record = isRecord(hitValue) ? hitValue : {};
    return {
        cityCode: getString(record.cityCode),
        cityName: getString(record.cityName),
        countryName: getString(record.countryName),
        type: getString(record.type) as TravelLocationType,
    };
};
