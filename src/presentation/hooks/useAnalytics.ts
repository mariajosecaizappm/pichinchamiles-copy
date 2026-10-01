import {useSelector} from "react-redux";
import {RootState} from "@/presentation/config/store";
import {AnalyticsPayload, EventName, TrackEventArgs} from "@/presentation/analytics/types";
import {trackEvent} from "@/presentation/analytics/dispatcher";
import useEncryption from "@/presentation/hooks/useEncryption";
import {
    getSessionCookieFromBrowser,
    setSessionCookieInBrowser,
} from "@/domain/entity/Session/sessionCookie";

const useAnalytics = () => {
    const member = useSelector((state: RootState) => state.user.information);
    const { encryptText } = useEncryption();

    const track = async <K extends EventName> (...args: TrackEventArgs<K>) => {
        const [name, payload] = args;

        let identification: string | undefined;

        if (member?.identificationNumber) {
            identification = await encryptText(member.identificationNumber);

            try {
                const currentSessionId = getSessionCookieFromBrowser();
                if (identification !== currentSessionId) {
                    setSessionCookieInBrowser(identification);
                }
            } catch {
                // ignore: not break tracking if cookie read/write fails
            }
        }

        const enrichedPayload = (payload === undefined
            ? {identification}
            : {
                ...payload,
                identification,
            }) as AnalyticsPayload<K>;
        trackEvent(name, enrichedPayload);
    }

    return {
        track
    }
};

export default useAnalytics;
