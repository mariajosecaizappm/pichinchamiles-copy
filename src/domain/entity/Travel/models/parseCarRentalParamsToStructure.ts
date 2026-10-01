import { CarRental, CarRentalParams, CarType } from '../structure/carRental';
import { parseDate, parseTime } from './parseDateTime';

export function parseCarRentalParamsToStructure(
    params: CarRentalParams,
): CarRental {
    return {
        carType: CarType.STANDARD,
        corporateDiscount: '0',
        pickUpLocation: params.pickUpLocation,
        dropOffLocation: params.dropOffLocation ?? params.pickUpLocation,
        pickUpDate: `${parseDate(params.pickUpDate)}_${parseTime(
            params.pickUpTime,
        )}`,
        dropOffDate: `${parseDate(params.dropOffDate)}_${parseTime(
            params.dropOffTime,
        )}`,
    };
}
