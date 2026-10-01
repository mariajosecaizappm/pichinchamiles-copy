import { parseFlightParamsToStructure } from '@/domain/entity/Travel/models/parseFlightParamsToStructure';
import { FlightParams } from '@/domain/entity/Travel/structure/flight';
import { TravelType } from '@/domain/entity/Travel/structure/travels';
import UltraviajesService from '@/domain/services/UltraviajesService';
import { injectable } from 'inversify';
import 'reflect-metadata';


@injectable()
export default class GetFlightsSearchUrlUseCase {
    execute(params: FlightParams): string {
        const baseUrl = UltraviajesService.getBaseUrl(TravelType.FLIGHTS);
        const {
            tripType,
            schedule,
            airline,
            cabin,
            legsType,
            routeType,
            adult,
            child,
            infant,
        } = parseFlightParamsToStructure(params);

        return `${baseUrl}/flights/availability/${tripType}/${schedule}/${airline}/${cabin}/${legsType}/${routeType}/${adult}/${child}/${infant}`;
    }
}
