import {inject, injectable} from "inversify";
import "reflect-metadata"
import type IAuthRepository from "@/domain/repository/Auth/IAuthRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {Otp} from "@/domain/entity/Otp/otp";
import RecaptchaService from "@/domain/services/RecaptchaService";
import ServiceTypes from "@/domain/entity/Types/ServiceTypes";
import type IEncryptionService from "@/domain/services/IEncryptionService";
import TokenService from "@/domain/services/TokenService";
import AuthServiceUv from "@/domain/services/AuthServiceUV";

@injectable()
export default class LoginUseCase {
    private readonly authRepository: IAuthRepository;
    private readonly encryptionService: IEncryptionService;

    constructor(
        @inject(RepositoryTypes.AuthRepository) authRepository: IAuthRepository,
        @inject(ServiceTypes.EncryptionService) encryptionService: IEncryptionService,
    ) {
        this.authRepository = authRepository;
        this.encryptionService = encryptionService;
    }

    async getOtp(identificationNumber: string, password: string): Promise<Otp>{
        const recaptchaAction = 'UserAndPassLogin';
        const recaptchaToken = await RecaptchaService.getToken(recaptchaAction);
        const encryptedIdentificationNumber =
            await this.encryptionService.encryptText(identificationNumber);
        const encryptedPassword = await this.encryptionService.encryptText(password);

        return this.authRepository.getLoginOtp(encryptedIdentificationNumber, encryptedPassword, recaptchaAction, recaptchaToken);
    }

    async verifyLoginOtp(identificationNumber: string, otpCode: string, otpToken: string): Promise<void> {
        const encryptedIdentificationNumber =
            await this.encryptionService.encryptText(identificationNumber);
        const encryptedOtpCode = await this.encryptionService.encryptText(otpCode);
        const encryptedOtpToken = await this.encryptionService.encryptText(otpToken);
        const {token, cookie} = await this.authRepository.verifyLoginOtp(encryptedIdentificationNumber, encryptedOtpCode, encryptedOtpToken);
        await TokenService.setToken(token)
        AuthServiceUv.LoginUv(cookie, token.refreshTokenExpireDate);
    }
}
