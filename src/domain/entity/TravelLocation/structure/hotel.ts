import { StringListParam } from '@/domain/entity/List/list';
import { TravelLocationBase, TravelLocationParamsBase } from './travelLocation';


export type HotelLocation = TravelLocationBase & {
  cityCode: string;
  cityName: string;
  countryName: string;
};

export interface HotelLocationsListParams extends TravelLocationParamsBase {
  cityCode: string | StringListParam;
  cityName: string | StringListParam;
  countryName: string | StringListParam;
}
