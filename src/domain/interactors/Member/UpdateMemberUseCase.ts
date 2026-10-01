import { inject, injectable } from "inversify"
import { MemberSecurityUpdate } from "@/domain/entity/Member/member"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes"
import ServiceTypes from "@/domain/entity/Types/ServiceTypes"
import type IEncryptionService from "@/domain/services/IEncryptionService"
import RecaptchaService from "@/domain/services/RecaptchaService"
import type IMemberRepository from "@/domain/repository/Member/IMemberRepository"
import "reflect-metadata"
import {Otp} from "@/domain/entity/Otp/otp";

@injectable()
export default class UpdateMemberUseCase {
    private readonly memberRepository: IMemberRepository
    private readonly encryptionService: IEncryptionService

    constructor(
        @inject(RepositoryTypes.MemberRepository) memberRepository: IMemberRepository,
        @inject(ServiceTypes.EncryptionService) encryptionService: IEncryptionService,
    ) {
        this.memberRepository = memberRepository
        this.encryptionService = encryptionService
    }

    async validateOtpUpdateInformation(memberSecurityUpdate: MemberSecurityUpdate): Promise<void> {
        const recaptchaAction = "UpdateInformation"
        const recaptchaToken = await RecaptchaService.getToken(recaptchaAction)
        const memberEncrypted = {
            ...memberSecurityUpdate,
            password:
                memberSecurityUpdate.password,
            enrollmentEmail:
                memberSecurityUpdate.enrollmentEmail,
        }
        return this.memberRepository.validateOtpUpdateInformation(
            memberEncrypted,
            recaptchaAction,
            recaptchaToken
        )
    }

    async updateMember(memberSecurityUpdate: MemberSecurityUpdate): Promise<Otp | null> {
        const recaptchaAction = "UpdateInformation"
        const recaptchaToken = await RecaptchaService.getToken(recaptchaAction)
        const memberEncrypted = {
            ...memberSecurityUpdate,
            password:
                memberSecurityUpdate.password &&
                (await this.encryptionService.encryptText(memberSecurityUpdate.password)),
            enrollmentEmail:
                memberSecurityUpdate.enrollmentEmail &&
                (await this.encryptionService.encryptText(memberSecurityUpdate.enrollmentEmail)),
        }
        return this.memberRepository.updateMember(memberEncrypted, recaptchaAction, recaptchaToken)
    }
}
