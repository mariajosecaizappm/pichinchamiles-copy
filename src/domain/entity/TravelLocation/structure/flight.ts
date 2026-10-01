import { StringListParam } from '@/domain/entity/List/list';
import { TravelLocationBase, TravelLocationParamsBase } from './travelLocation';

export type FlightLocation = TravelLocationBase & {
  id: string;
  code: string;
  name: string;
  description: string;
  countryCode: string;
};

export interface FlightLocationsListParams extends TravelLocationParamsBase {
  description: string | StringListParam;
}
