// @ts-expect-error The SDK package does not expose compatible TypeScript types.
import kountSDK from '@kount/kount-web-client-sdk'
import KountError from "@/domain/entity/Error/models/KountError";
export default class KountService{
    private static kountConfig = {
        clientID: process.env.NEXT_PUBLIC_KOUNT_CLIENT_ID,
        hostname: process.env.NEXT_PUBLIC_KOUNT_HOSTNAME,
        environment: process.env.NEXT_PUBLIC_KOUNT_ENVIRONMENT,
        isSinglePageApp: false
    }


    static kountCollection(): string{
        const sessionId = crypto.randomUUID().replace(/-/g, '');

        if(Object.values(KountService.kountConfig).every(value=> !value)){
            throw new KountError('Config not found')
        }

        const sdk = kountSDK(KountService.kountConfig, sessionId);

        if(sdk?.error && sdk.error.length > 0){
            throw new KountError(`Kount conection failed: ${sdk.error}`);
        }

        return sessionId
    }
}
