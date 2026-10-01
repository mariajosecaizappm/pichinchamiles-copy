import { List } from '@/domain/entity/List/list';
import { CarRentalListParams, CarRentalLocation, FlightLocationsListParams, FlightLocation, HotelLocationsListParams, HotelLocation } from '@/domain/entity/TravelLocation';

export default interface ITravelLocationRepository {
  getFlightLocations(params: FlightLocationsListParams): Promise<List<FlightLocation>>;
  getHotelLocations(params: HotelLocationsListParams): Promise<List<HotelLocation>>;
  getCarRentalLocations(params: CarRentalListParams): Promise<List<CarRentalLocation>>;
}
