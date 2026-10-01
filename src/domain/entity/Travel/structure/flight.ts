import { BaseTravel } from "./travels";

export enum TripType {
    SINGLE = 'SINGLE',
    ROUND = 'ROUND',
    MULTIPLE = 'MULTIPLE',
}

export type TripParams = {
  origin: string;
  destination: string;
  startDate: Date;
  endDate?: Date;
};

export enum LegsType {
    NON_STOP = 'non-stop',
    ONE_STOP = '1',
    SECOND_STOP = '2',
    ALL_STOPS = 'all-stops',
}

export enum CabinType {
    ANY = 'any',
    FIRST = 'first',
    BUSINESS = 'business',
    ECONOMY = 'economy',
    PREMIUM_ECONOMY = 'premiumEconomy',
    PREMIUM_FIRST = 'premiumFirst',
    PREMIUM_BUSINESS = 'premiumBusiness',
}

export enum RouteType {
  DOMESTIC = 'domestic',
  INTERNATIONAL = 'international',
}

export type FlightParams = {
  tripType: TripType;
  trips: TripParams[];
  adults: number;
  childrens: number;
  infants: number;
  stops: LegsType;
  class: CabinType;
  airline: string;
  routeType: RouteType;
};

export type Flight = BaseTravel & {
  tripType: TripType;
  schedule: string;
  airline: string;
  cabin: CabinType;
  legsType: LegsType;
  routeType: RouteType;
  adult: string;
  child: string;
  infant: string;
};