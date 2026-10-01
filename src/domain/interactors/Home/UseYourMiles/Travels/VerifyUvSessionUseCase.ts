import "reflect-metadata"
import {injectable} from "inversify";
import AuthServiceUv from "@/domain/services/AuthServiceUV";

@injectable()
export default class VerifyUvSessionUseCase {
    isValidUvSession(){
        return AuthServiceUv.isCookiePresent()
    }
}