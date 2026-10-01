import { TravelType } from "../entity/Travel/structure/travels";


export default class UltraviajesService {
    static getBaseUrl(travelType: TravelType) {
        switch (travelType) {
        case TravelType.CAR_RENTAL:
            return process.env.NEXT_PUBLIC_UV_METEOR as string;
        case TravelType.DISNEY:
            return process.env.NEXT_PUBLIC_UV_DISNEY as string;
        default:
            return process.env.NEXT_PUBLIC_UV_ANGULAR as string;
        }
    }
}
