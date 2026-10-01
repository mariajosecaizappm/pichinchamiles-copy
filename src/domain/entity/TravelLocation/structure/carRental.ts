import { StringListParam } from "../../List/list";
import { TravelLocationBase, TravelLocationParamsBase } from "./travelLocation";


export type CarRentalLocation = TravelLocationBase & {
  id: string;
  code: string;
  cityCode: string;
  cityName: string;
  countryName: string;
  countryCode: string;
  continentCode: string;
  name: string;
  region: string;
};

export interface CarRentalListParams extends TravelLocationParamsBase {
  cityCode: string | StringListParam;
  cityName: string | StringListParam;
  countryName: string | StringListParam;
  zone: string | StringListParam
}
