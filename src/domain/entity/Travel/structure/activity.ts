import { BaseTravel } from './travels';

export type Activity = BaseTravel & {
  destination: string;
  startDate: string;
  endDate: string;
  passengers: string;
};

export type ActivityParams = {
  destination: string;
  endDate: Date;
  age: number;
};
