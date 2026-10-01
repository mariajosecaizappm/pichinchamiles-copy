import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import RepositoryTypes from '@/domain/entity/Types/RepositoryTypes';
import type ITravelLocationRepository from '@/domain/repository/TravelLocation/ITravelLocationRepository';
import {
    HotelLocation,
    TravelLocationType,
} from '@/domain/entity/TravelLocation';
import { StringComparator } from '@/domain/entity/List/list';

@injectable()
export default class GetHotelsLocationsUseCase {
    private readonly repository: ITravelLocationRepository;

    constructor(
        @inject(RepositoryTypes.TravelLocationRepository)
            repository: ITravelLocationRepository,
    ) {
        this.repository = repository;
    }

    async execute(search: string): Promise<HotelLocation[]> {
        const travelLocations = await this.repository.getHotelLocations({
            page: 1,
            pageSize: 20,
            cityCode: { value: search, comparator: StringComparator.CONTAINS },
            cityName: { value: search, comparator: StringComparator.CONTAINS },
            countryName: { value: search, comparator: StringComparator.CONTAINS },
            type: TravelLocationType.HOTELS,
        });

        return travelLocations.data;
    }
}
