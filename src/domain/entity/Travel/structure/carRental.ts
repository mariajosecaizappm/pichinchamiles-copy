
export enum CarType {
  STANDARD = 'standard',
  VANS = 'vans',
  SUV = 'suv',
  LUXURY = 'luxury',
  ADRENALINE = 'adrenaline',
  PRESTIGE = 'prestige',
  DREAM = 'dream',
  GREEN = 'green',
}

export type CarRental = {
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: string;
  dropOffDate: string;
  carType: CarType;
  corporateDiscount: string;
};

export type CarRentalParams = {
  pickUpLocation: string;
  dropOffLocation?: string;
  pickUpDate: Date;
  pickUpTime: Date;
  dropOffDate: Date;
  dropOffTime: Date;
};
