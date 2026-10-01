import "reflect-metadata"
import {inject, injectable} from "inversify";
import type IEncryptionService from "@/domain/services/IEncryptionService";
import ServiceTypes from "@/domain/entity/Types/ServiceTypes";

@injectable()
export default class EncryptTextUseCase{
    private readonly encryptionService: IEncryptionService;

    constructor(@inject(ServiceTypes.EncryptionService) encryptionService: IEncryptionService) {
        this.encryptionService = encryptionService;
    }

    encryptText(text: string): Promise<string>{
        return this.encryptionService.encryptText(text);
    }
}