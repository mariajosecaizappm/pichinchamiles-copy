import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import RepositoryTypes from '@/domain/entity/Types/RepositoryTypes';
import type ITravelLocationRepository from '@/domain/repository/TravelLocation/ITravelLocationRepository';
import {
    CarRentalLocation,
    TravelLocationType,
} from '@/domain/entity/TravelLocation';
import { StringComparator } from '@/domain/entity/List/list';

@injectable()
export default class GetCarRentalLocationsUseCase {
    private repository: ITravelLocationRepository;

    constructor(
    @inject(RepositoryTypes.TravelLocationRepository)
        repository: ITravelLocationRepository,
    ) {
        this.repository = repository;
    }

    async execute(search: string): Promise<CarRentalLocation[]> {
        const travelLocations = await this.repository.getCarRentalLocations({
            page: 1,
            pageSize: 20,
            cityCode: { value: search, comparator: StringComparator.CONTAINS },
            cityName: { value: search, comparator: StringComparator.CONTAINS },
            countryName: { value: search, comparator: StringComparator.CONTAINS },
            zone: { value: 'None', comparator: StringComparator.NOT_EQUAL },
            type: TravelLocationType.CAR_RENTAL,
        });

        return travelLocations.data;
    }
}
