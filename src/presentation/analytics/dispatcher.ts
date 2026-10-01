import algoliaProvider from "@/presentation/analytics/providers/algoliaProvider";
import {AnalyticsEvent, AnalyticsPayload, EventName} from "@/presentation/analytics/types";
import gaProvider from "@/presentation/analytics/providers/gaProvider";
import gtmProvider from "@/presentation/analytics/providers/gtmProvider/gtmProvider";
import pixelProvider from "@/presentation/analytics/providers/pixelProvider";

const activeProviders = [algoliaProvider, gaProvider, gtmProvider, pixelProvider];
export const trackEvent = <K extends EventName> (name: K, payload: AnalyticsPayload<K>) => {
    const eventToDispatch = {
        name,
        payload
    } as unknown as AnalyticsEvent;
    activeProviders.forEach(provider => {
        try {
            provider.track(eventToDispatch);
        }catch(e){
            console.error(e);
        }
    })
}