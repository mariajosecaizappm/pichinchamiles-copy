
import { getCarRentalLocationsAdapter } from '@/data/adapters/TravelLocations/carRentalLocationsAdapter';
import { getFlightLocationsAdapter } from '@/data/adapters/TravelLocations/flightLocationsAdapter';
import { getHotelLocationsAdapter } from '@/data/adapters/TravelLocations/hotelLocationsAdapter';
import AlgoliaClient from '@/data/provider/algolia/algoliaClient';
import { AlgoliaIndex } from '@/data/provider/algolia/types';
import { List } from '@/domain/entity/List/list';
import { CarRentalListParams, CarRentalLocation, FlightLocation, FlightLocationsListParams, HotelLocation, HotelLocationsListParams } from '@/domain/entity/TravelLocation';
import ITravelLocation from '@/domain/repository/TravelLocation/ITravelLocationRepository';
import { injectable } from 'inversify';
import 'reflect-metadata';
import RepositoryBase from '../RepositoryBase';

@injectable()
export default class TravelLocationRepository extends RepositoryBase implements ITravelLocation {
    private readonly algoliaClient = new AlgoliaClient(AlgoliaIndex.TRAVEL_LOCATIONS);

    async getFlightLocations(params: FlightLocationsListParams): Promise<List<FlightLocation>> {
        const {list} = await this.algoliaClient.search({
            params: {
                ...params,
            },
            adapter: getFlightLocationsAdapter
        })

        return list
    }

    async getHotelLocations(params: HotelLocationsListParams): Promise<List<HotelLocation>> {
        const {list} = await this.algoliaClient.search({
            params: {
                ...params,
            },
            adapter: getHotelLocationsAdapter
        })

        return list
    }

    async getCarRentalLocations(params: CarRentalListParams):Promise<List<CarRentalLocation>> {
        const {list} = await this.algoliaClient.search({
            params: {
                ...params,
            },
            adapter: getCarRentalLocationsAdapter
        })

        return list
    }

}
