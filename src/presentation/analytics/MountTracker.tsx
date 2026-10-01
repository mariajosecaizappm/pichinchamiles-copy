'use client';

import { useEffect, useRef } from 'react';
import useAnalytics from "@/presentation/hooks/useAnalytics";
import { EventName, EventPayloadMap } from "@/presentation/analytics/types";

export type MountTrackerProps = {
    [K in EventName]:
        [EventPayloadMap[K]] extends [undefined]
            ? { name: K }
            : { name: K; payload: EventPayloadMap[K] }
}[EventName];

export const MountTracker = (props: MountTrackerProps) => {
    const { track } = useAnalytics();
    const hasTracked = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (hasTracked.current) return;

        const { name, payload } = props as { name: EventName; payload?: EventPayloadMap[EventName] };
        track(name, payload);

        hasTracked.current = true;
    }, [props, track]);

    return null;
};
