import { injectable } from 'inversify';
import 'reflect-metadata';
import UltraviajesService from '@/domain/services/UltraviajesService';
import { TravelType } from '@/domain/entity/Travel/structure/travels';
import { CarRentalParams } from '@/domain/entity/Travel/structure/carRental';
import { parseCarRentalParamsToStructure } from '@/domain/entity/Travel/models/parseCarRentalParamsToStructure';


@injectable()
export default class GetCarRentalSearchUrlUseCase {
    execute(params: CarRentalParams): string {
        const baseUrl = UltraviajesService.getBaseUrl(TravelType.CAR_RENTAL);
        const {
            carType,
            dropOffDate,
            dropOffLocation,
            pickUpDate,
            pickUpLocation,
        } = parseCarRentalParamsToStructure(params);

        return `${baseUrl}/cars/search/${pickUpLocation}-${dropOffLocation}/${pickUpDate}/${dropOffDate}/${carType}`;
    }
}
