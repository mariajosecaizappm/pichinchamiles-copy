import { BaseTravel } from './travels';

export type Hotel = BaseTravel & {
  destination: string;
  checkIn: string;
  checkOut: string;
  roomPreferences: string;
};

export type HotelParams = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  ageChildrens: number[];
};
