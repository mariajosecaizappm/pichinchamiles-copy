import {AnalyticsEvent} from "@/presentation/analytics/types";

export default interface AnalyticsProvider{
    name: string
    track(event: AnalyticsEvent): void;
}