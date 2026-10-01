import { injectable } from 'inversify';
import 'reflect-metadata';
import UltraviajesService from '@/domain/services/UltraviajesService';
import { TravelType } from '@/domain/entity/Travel/structure/travels';
import { parseHotelParamsToStructure } from '@/domain/entity/Travel/models/parseHotelParamsToStructure';
import { HotelParams } from '@/domain/entity/Travel/structure/hotel';

@injectable()
export default class GetHotelsSearchUrlUseCase {
    execute(params: HotelParams): string {
        const baseUrl = UltraviajesService.getBaseUrl(TravelType.FLIGHTS);
        const { destination, checkIn, checkOut, roomPreferences } =
            parseHotelParamsToStructure(params);

        return `${baseUrl}/hotels/search/${destination}/${checkIn}/${checkOut}/${roomPreferences}`;
    }
}
