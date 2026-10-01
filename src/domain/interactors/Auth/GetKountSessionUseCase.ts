import {injectable} from "inversify";
import "reflect-metadata"
import KountService from "@/domain/services/KountService";

@injectable()
export default class GetKountSessionUseCase {
    getSessionId(): string{
        return KountService.kountCollection()
    }
}