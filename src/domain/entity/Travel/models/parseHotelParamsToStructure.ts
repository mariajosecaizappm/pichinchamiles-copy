import { Hotel, HotelParams } from '../structure/hotel';
import { parseDate } from './parseDateTime';

export function parseHotelParamsToStructure(params: HotelParams): Hotel {
    return {
        roomPreferences: parseRoomPreferences(params),
        checkIn: parseDate(params.checkIn),
        checkOut: parseDate(params.checkOut),
        destination: params.destination,
        promoCode: '0',
    };
}

function parseRoomPreferences(params: HotelParams): string {
    const childrensNum = params.ageChildrens.length;
    const parsedAges = params.ageChildrens.join('-');
    const childrensShape =
        childrensNum > 0 ? `_${childrensNum}-children-${parsedAges}` : '';
    return `${params.adults}-adults${childrensShape}`;
}
