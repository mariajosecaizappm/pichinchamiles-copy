import { CarRentalLocation, TravelLocationType } from '@/domain/entity/TravelLocation';
import { getString, isRecord } from '../commonAdapters';

export const getCarRentalLocationsAdapter = (
    hitValue: unknown,
): CarRentalLocation => {
    const record = isRecord(hitValue) ? hitValue : {};
    return {
        id: getString(record.id),
        code: getString(record.code),
        cityCode: getString(record.cityCode),
        cityName: getString(record.cityName),
        countryName: getString(record.countryName),
        countryCode: getString(record.countryCode),
        continentCode: getString(record.continentCode),
        name: getString(record.name),
        region: getString(record.region),
        type: getString(record.type) as TravelLocationType,
    };
};

export const getListCartRentalLocationsAdapter = (data: CarRentalLocation[]): CarRentalLocation[] => {
  
    const dataFilter: CarRentalLocation[] = data.filter(item => item !== undefined);

    return dataFilter
}
