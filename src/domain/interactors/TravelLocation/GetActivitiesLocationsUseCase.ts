import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import RepositoryTypes from '@/domain/entity/Types/RepositoryTypes';
import type ITravelLocationRepository from '@/domain/repository/TravelLocation/ITravelLocationRepository';
import {
    ActivityLocation,
} from '@/domain/entity/TravelLocation/structure/activity';
import { TravelLocationType } from '@/domain/entity/TravelLocation';
import { StringComparator } from '@/domain/entity/List/list';

@injectable()
export default class GetActivitiesLocationsUseCase {
    private readonly repository: ITravelLocationRepository;

    constructor(
        @inject(RepositoryTypes.TravelLocationRepository)
            repository: ITravelLocationRepository,
    ) {
        this.repository = repository;
    }

    async execute(search: string): Promise<ActivityLocation[]> {
        const travelLocations = await this.repository.getHotelLocations({
            page: 1,
            pageSize: 20,
            cityCode: { value: search, comparator: StringComparator.CONTAINS },
            cityName: { value: search, comparator: StringComparator.CONTAINS },
            countryName: { value: search, comparator: StringComparator.CONTAINS },
            type: TravelLocationType.ACTIVITIES,
        });

        return travelLocations.data;
    }
}
