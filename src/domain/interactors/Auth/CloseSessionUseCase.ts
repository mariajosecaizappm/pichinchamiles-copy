import {inject, injectable} from "inversify";
import type IAuthRepository from "@/domain/repository/Auth/IAuthRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import TokenService from "@/domain/services/TokenService";
import AuthServiceUv from "@/domain/services/AuthServiceUV";
import {
    generateSessionId,
    setSessionCookieInBrowser,
} from "@/domain/entity/Session/sessionCookie";

@injectable()
export default class CloseSessionUseCase {
    private readonly authRepository: IAuthRepository;

    constructor(@inject(RepositoryTypes.AuthRepository) authRepository: IAuthRepository) {
        this.authRepository = authRepository;
    }

    async closeSession() {
        const token = await TokenService.getToken();

        if(token){
            try{
                await this.authRepository.revokeToken(token);
            }catch{}
        }

        AuthServiceUv.CloseSession()
        await TokenService.clearToken();
        setSessionCookieInBrowser(generateSessionId());
    }
}