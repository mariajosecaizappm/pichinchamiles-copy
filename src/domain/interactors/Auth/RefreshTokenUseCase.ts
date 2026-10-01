import {inject, injectable} from "inversify";
import "reflect-metadata"
import type IAuthRepository from "@/domain/repository/Auth/IAuthRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {Token} from "@/domain/entity/Token/token";
import TokenService from "@/domain/services/TokenService";
import RecaptchaService from "@/domain/services/RecaptchaService";
import AuthServiceUv from "@/domain/services/AuthServiceUV";

@injectable()
export default class RefreshTokenUseCase{
    private readonly authRepository: IAuthRepository;

    constructor(@inject(RepositoryTypes.AuthRepository) authRepository: IAuthRepository) {
        this.authRepository = authRepository;
    }

    async refresh(): Promise<Token>{
        const recaptchaAction = 'RefreshToken';
        const recaptchaToken = await RecaptchaService.getToken(recaptchaAction);
        const {token, cookie} = await this.authRepository.refreshToken(recaptchaToken, recaptchaAction);
        await TokenService.setToken(token);
        AuthServiceUv.LoginUv(cookie, token.refreshTokenExpireDate);
        return token;
    }
}