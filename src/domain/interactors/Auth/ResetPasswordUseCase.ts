import {inject, injectable} from "inversify";
import "reflect-metadata"
import type IAuthRepository from "@/domain/repository/Auth/IAuthRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {MfaRequest, Otp} from "@/domain/entity/Otp/otp";
import RecaptchaService from "@/domain/services/RecaptchaService";
import ServiceTypes from "@/domain/entity/Types/ServiceTypes";
import type IEncryptionService from "@/domain/services/IEncryptionService";
import TokenService from "@/domain/services/TokenService";
import AuthServiceUv from "@/domain/services/AuthServiceUV";

@injectable()
export default class ResetPasswordUseCase {
    private readonly authRepository: IAuthRepository;
    private readonly encryptionService: IEncryptionService;

    constructor(
        @inject(RepositoryTypes.AuthRepository) authRepository: IAuthRepository,
        @inject(ServiceTypes.EncryptionService) encryptionService: IEncryptionService,
    ) {
        this.authRepository = authRepository;
        this.encryptionService = encryptionService;
    }

    async getOtp(identificationNumber: string): Promise<Otp>{
        const recaptchaAction = 'ForgotPassword';
        const recaptchaToken = await RecaptchaService.getToken(recaptchaAction);
        return this.authRepository.getResetPasswordOtp(identificationNumber, recaptchaAction, recaptchaToken);
    }

    async verifyOtp(identificationNumber: string, otpCode: string, otpToken: string): Promise<string>{
        const encryptedIdentificationNumber =
            await this.encryptionService.encryptText(identificationNumber);
        return this.authRepository.verifyResetPasswordOtp(
            encryptedIdentificationNumber,
            otpCode,
            otpToken,
        );
    }

    async resetPassword(identification: string, mfaRequest: MfaRequest, resetPasswordToken: string, password: string): Promise<void>{
        const encryptedPassword = await this.encryptionService.encryptText(password);
        const { token, cookie } = await this.authRepository.resetPassword(identification, mfaRequest, resetPasswordToken, encryptedPassword);
        await TokenService.setToken(token)
        AuthServiceUv.LoginUv(cookie, token.refreshTokenExpireDate);
    }
}
