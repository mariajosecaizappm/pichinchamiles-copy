import {inject, injectable} from "inversify";
import "reflect-metadata"
import type IAuthRepository from "@/domain/repository/Auth/IAuthRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {Authentication} from "@/domain/entity/Auth/auth";
import RecaptchaService from "@/domain/services/RecaptchaService";
import ServiceTypes from "@/domain/entity/Types/ServiceTypes";
import type IEncryptionService from "@/domain/services/IEncryptionService";

@injectable()
export default class OnboardingUseCase {
    private readonly authRepository: IAuthRepository
    private readonly encryptionService: IEncryptionService

    constructor(
        @inject(RepositoryTypes.AuthRepository) authRepository: IAuthRepository,
        @inject(ServiceTypes.EncryptionService) encryptionService: IEncryptionService,
    ) {
        this.authRepository = authRepository
        this.encryptionService = encryptionService
    }

    async verifyIdentification(identificationNumber: string): Promise<Authentication>{
        const recaptchaAction = 'verifyIdentification';
        const recaptchaToken = await RecaptchaService.getToken(recaptchaAction)
        const encryptedIdentificationNumber =
            await this.encryptionService.encryptText(identificationNumber);

        return this.authRepository.verifyMemberIdentification(encryptedIdentificationNumber, recaptchaAction, recaptchaToken)
    }
}
