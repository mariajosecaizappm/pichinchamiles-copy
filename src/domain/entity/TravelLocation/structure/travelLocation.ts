import { ListParams } from "../../List/list";


export enum TravelLocationType {
  FLIGHTS = 'flight',
  CAR_RENTAL = 'car',
  HOTELS = 'hotel',
  ACTIVITIES = 'activity',
}

export type TravelLocationBase = {
  type: TravelLocationType;
};

export interface TravelLocationParamsBase extends ListParams {
  type: TravelLocationType;
}
