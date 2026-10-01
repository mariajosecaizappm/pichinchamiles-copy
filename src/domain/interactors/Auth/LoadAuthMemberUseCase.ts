import {inject, injectable} from "inversify";
import "reflect-metadata"
import type IAuthRepository from "@/domain/repository/Auth/IAuthRepository";
import type IMemberRepository from "@/domain/repository/Member/IMemberRepository";
import type ICurrencyRepository from "@/domain/repository/Currency/ICurrencyRepository";
import type IBasketRepository from "@/domain/repository/BasketRepository/IBasketRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {AuthMember} from "@/domain/entity/Member/authMember";
import ServiceTypes from "@/domain/entity/Types/ServiceTypes";
import type IEncryptionService from "@/domain/services/IEncryptionService";
import TokenService from "@/domain/services/TokenService";
import RecaptchaService from "@/domain/services/RecaptchaService";
import {ApiError} from "@/domain/entity/Error/models/ApiError";
import {ErrorCode} from "@/domain/entity/Error/structure/error";
import type IApigeeRepository from "@/domain/repository/Member/IApigeeRepository";
import LopdPreferencesService from "@/domain/services/LopdPreferencesService";
import { setSessionCookieInBrowser } from "@/domain/entity/Session/sessionCookie";

@injectable()
export default class LoadAuthMemberUseCase {
    private readonly authRepository: IAuthRepository;
    private readonly memberRepository: IMemberRepository;
    private readonly currencyRepository: ICurrencyRepository;
    private readonly basketRepository: IBasketRepository;
    private readonly apigeeRepository: IApigeeRepository;
    private readonly encryptionService: IEncryptionService;

    constructor(
        @inject(RepositoryTypes.MemberRepository) memberRepository: IMemberRepository,
        @inject(RepositoryTypes.CurrencyRepository) currencyRepository: ICurrencyRepository,
        @inject(RepositoryTypes.AuthRepository) authRepository: IAuthRepository,
        @inject(RepositoryTypes.BasketRepository) basketRepository: IBasketRepository,
        @inject(RepositoryTypes.ApigeeRepository) apigeeRepository: IApigeeRepository,
        @inject(ServiceTypes.EncryptionService) encryptionService: IEncryptionService,
    ) {
        this.memberRepository = memberRepository;
        this.currencyRepository = currencyRepository;
        this.authRepository = authRepository;
        this.basketRepository = basketRepository;
        this.apigeeRepository = apigeeRepository;
        this.encryptionService = encryptionService;
    }

    async getAuthMember(): Promise<AuthMember>{
        const programCurrency = await this.currencyRepository.getProgramCurrency();
        const [member, balance, basket, cif] = await Promise.all([
            this.memberRepository.getMember(),
            this.memberRepository.getMemberBalance(programCurrency.pointsCurrencyId),
            this.basketRepository.getBasket(),
            this.apigeeRepository.getCif()
        ])

        const decryptedIdentificationNumber =
            (await this.encryptionService.decryptText(member.identificationNumber)) ||
            member.identificationNumber
        const isSkippedLopd = await LopdPreferencesService.isSkippedLopd(decryptedIdentificationNumber);
        const consent = cif && cif !== "" ? await this.apigeeRepository.getConsent(cif) : null;

        if (consent && consent.hasConsent === true && !member.acceptLopd) {
            const recaptchaAction = 'UpdateLopd';
            const recaptchaToken = await RecaptchaService.getToken(recaptchaAction);
            await this.memberRepository.updateLopd(true, "web", recaptchaAction, recaptchaToken);
            member.acceptLopd = true;
        }
        void isSkippedLopd;

        const result: AuthMember = {
            member: {
                ...member,
                enrollmentEmail: await this.encryptionService.decryptText(member.enrollmentEmail),
                cellPhone: await this.encryptionService.decryptText(member.cellPhone),
                birthDay:  new Date(await this.encryptionService.decryptText(member.birthDay)).toLocaleDateString('es-EC',{
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }),
                identificationNumber: decryptedIdentificationNumber,
            },
            balance,
            currency: programCurrency,
            basket,
            cif: cif || "",
            consent
        }
        try {
            if (typeof this.encryptionService.encryptText === 'function') {
                const encryptedIdentification = await this.encryptionService.encryptText(decryptedIdentificationNumber);
                setSessionCookieInBrowser(encryptedIdentification);
            }
        } catch {
            /* ignore: setSessionCookieInBrowser guard cuando isBrowser=true, encryptText podría no estar disponible en entornos headless/test */
        }
        return result;
    }

    async loadAuthMember(): Promise<AuthMember>{
        const token = await TokenService.getToken();
        let isValidCookie = false;

        if (!token) {
            const recaptchaAction = 'validateSession';
            const recaptchaToken = await RecaptchaService.getToken(recaptchaAction);
            try {
                isValidCookie = await this.authRepository.isValidCookie(recaptchaToken, recaptchaAction);
            } catch {
                isValidCookie = false;
            }
        }

        if (token || isValidCookie) {
            try {
                return await this.getAuthMember()
            }catch (error) {
                await TokenService.clearToken();
                throw error
            }
        }else{
            throw new ApiError(ErrorCode.UNKNOWN)
        }
    }
}
