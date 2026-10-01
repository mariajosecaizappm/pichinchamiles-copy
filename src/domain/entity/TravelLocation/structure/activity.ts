import { StringListParam } from '@/domain/entity/List/list';
import { TravelLocationBase, TravelLocationParamsBase } from './travelLocation';


export type ActivityLocation = TravelLocationBase & {
    cityCode: string;
    cityName: string;
    countryName: string;
};

export interface ActivityLocationsListParams extends TravelLocationParamsBase {
    cityCode: string | StringListParam;
    cityName: string | StringListParam;
    countryName: string | StringListParam;
}
