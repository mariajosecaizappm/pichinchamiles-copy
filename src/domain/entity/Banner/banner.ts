import { ListParams, NumberListParam } from "../List/list";
import { MarketingPositions } from "../Marketing/marketing";

export enum BannerCategory{
    UV_HOTELS = 'ultraviajes-hoteles',
    UV_ACTIVITIES = 'ultraviajes-actividades',
    UV_FLIGHTS = 'ultraviajes-vuelos',
    UV_CARS = 'ultraviajes-autos',
    UV_DISNEY = 'ultraviajes-disney'
}

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  summary: string;
  link: string;
  linkText?: string;
  textColor: string;
  image: {
    desktopUrl: string;
    mobileUrl: string;
  };
  positions: MarketingPositions[];
  segmentCodes: string[];
  priority: number;
  isOutstanding: boolean;
  campaignId: string;
};

export interface BannerParams extends ListParams {
  positions?: MarketingPositions[];
  campaignId?: string[];
  priority?: number | NumberListParam;
  isOutstanding?: boolean;
  category?: BannerCategory[]
}
