import {inject, injectable} from "inversify";
import type IAuthRepository from "@/domain/repository/Auth/IAuthRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import ServiceTypes from "@/domain/entity/Types/ServiceTypes";
import type IEncryptionService from "@/domain/services/IEncryptionService";
import {ActiveAccountArgs} from "@/domain/entity/Auth/auth";
import TokenService from "@/domain/services/TokenService";
import AuthServiceUv from "@/domain/services/AuthServiceUV";

@injectable()
export default class ActivationUseCase {
    private readonly authRepository: IAuthRepository
    private readonly encryptionService: IEncryptionService

    constructor(
        @inject(RepositoryTypes.AuthRepository) authRepository: IAuthRepository,
        @inject(ServiceTypes.EncryptionService) encryptionService: IEncryptionService,
    ) {
        this.authRepository = authRepository;
        this.encryptionService = encryptionService;
    }

    async verifyOtp(identificationNumber: string, mfaToken: string, mfaCode: string): Promise<string>{
        const encryptedIdentificationNumber =
            await this.encryptionService.encryptText(identificationNumber);
        return this.authRepository.verifyActivationOtp(
            encryptedIdentificationNumber,
            mfaCode,
            mfaToken,
        );
    }

    async activateAccount(args: ActiveAccountArgs): Promise<void>{
        const accountActivationRequestEncrypted = {
            ...args,
            identificationNumber: await this.encryptionService.encryptText(args.identificationNumber),
            password: await this.encryptionService.encryptText(args.password),
        }
        const {token, cookie} = await this.authRepository.activeAccount(accountActivationRequestEncrypted);
        await TokenService.setToken(token);
        AuthServiceUv.LoginUv(cookie, token.refreshTokenExpireDate);
    }
}
