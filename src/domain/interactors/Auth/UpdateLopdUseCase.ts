import {inject, injectable} from "inversify";
import "reflect-metadata";
import type IMemberRepository from "@/domain/repository/Member/IMemberRepository";
import type IApigeeRepository from "@/domain/repository/Member/IApigeeRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {Member} from "@/domain/entity/Member/member";
import RecaptchaService from "@/domain/services/RecaptchaService";
import {Consent} from "@/domain/entity/Member/consent";
import LopdPreferencesService from "@/domain/services/LopdPreferencesService";

@injectable()
export default class UpdateLopdUseCase {
    private readonly memberRepository: IMemberRepository;
    private readonly apigeeRepository: IApigeeRepository;

    constructor(
        @inject(RepositoryTypes.MemberRepository) memberRepository: IMemberRepository,
        @inject(RepositoryTypes.ApigeeRepository) apigeeRepository: IApigeeRepository,
    ) {
        this.memberRepository = memberRepository;
        this.apigeeRepository = apigeeRepository;
    }

    async updateLopd(member: Member, cif: string, consent: Consent | null, acceptedLopd: boolean): Promise<void> {
        if(!member.acceptLopd){
            const recaptchaAction = 'UpdateLopd';
            const recaptchaToken = await RecaptchaService.getToken(recaptchaAction)
            await this.memberRepository.updateLopd(acceptedLopd, "web", recaptchaAction, recaptchaToken);
        }

        if(consent){
            await this.apigeeRepository.updateConsent({
                ...consent,
                cif,
                hasConsent: acceptedLopd,
                acceptedTermsConditions: true,
                action: consent.hasConsent === null ? 'register' : 'update',
            })
        }
    }

    async updateMemberAcceptLopd(acceptedLopd: boolean): Promise<void> {
        const recaptchaAction = 'UpdateLopd';
        const recaptchaToken = await RecaptchaService.getToken(recaptchaAction);
        await this.memberRepository.updateLopd(acceptedLopd, "web", recaptchaAction, recaptchaToken);
    }

    skipLopd(identificationNumber: string, expiresInSeconds: number): Promise<void>{
        return LopdPreferencesService.skipLopd(identificationNumber, expiresInSeconds);
    }

    isSkippedLopd(identificationNumber: string): Promise<boolean>{
        return LopdPreferencesService.isSkippedLopd(identificationNumber);
    }

    clearLopdPreference(): void{
        return LopdPreferencesService.clearPreferences();
    }
}
