import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import type ITravelLocationRepository from '@/domain/repository/TravelLocation/ITravelLocationRepository';
import { StringComparator } from '@/domain/entity/List/list';
import {
    TravelLocationType,
    FlightLocation,
} from '@/domain/entity/TravelLocation';
import RepositoryTypes from '@/domain/entity/Types/RepositoryTypes';

@injectable()
export default class GetFlightsLocationsUseCase {
    private repository: ITravelLocationRepository;

    constructor(
    @inject(RepositoryTypes.TravelLocationRepository)
        repository: ITravelLocationRepository,
    ) {
        this.repository = repository;
    }

    async execute(search: string): Promise<FlightLocation[]> {
        const travelLocations = await this.repository.getFlightLocations({
            page: 1,
            pageSize: 10,
            description: { value: search, comparator: StringComparator.CONTAINS },
            type: TravelLocationType.FLIGHTS,
        });

        return travelLocations.data;
    }
}
