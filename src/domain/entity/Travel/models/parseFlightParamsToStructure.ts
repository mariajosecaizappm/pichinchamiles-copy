import { Flight, FlightParams, TripType } from '../structure/flight';
import { parseDate } from './parseDateTime';

export function parseFlightParamsToStructure(params: FlightParams): Flight {
    const schedule = parseSchedule(params);

    return {
        tripType: params.tripType,
        schedule,
        cabin: params.class,
        legsType: params.stops,
        routeType: params.routeType,
        adult: `${params.adults}_adult`,
        child: `${params.childrens}_child`,
        infant: `${params.infants}_infant`,
        promoCode: '0',
        airline: params.airline !== '' ? params.airline : 'all',
    };
}

function parseSchedule(params: FlightParams): string {
    const defaultTrip = params.trips[0];
    const from = defaultTrip.origin;
    const to = defaultTrip.destination;
    const dateFrom = parseFlightDate(defaultTrip.startDate);

    switch (params.tripType) {
    case TripType.ROUND: {
        const dateEnd =
        defaultTrip.endDate && parseFlightDate(defaultTrip.endDate);
        return `${dateFrom}_${from}_${to}-${dateEnd}_${to}_${from}`;
    }
    case TripType.SINGLE:
        return `${dateFrom}_${from}_${to}`;
    case TripType.MULTIPLE: {
        const trips: string[] = [];
        params.trips.forEach((trip) => {
            trips.push(
                `${parseFlightDate(trip.startDate)}_${trip.origin}_${
                    trip.destination
                }`,
            );
        });

        return trips.join('-');
    }
    }
}

function parseFlightDate(date: Date): string {
    return parseDate(date).split('-').join('');
}
