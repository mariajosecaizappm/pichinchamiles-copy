import { Member, MemberSecurityUpdate } from "@/domain/entity/Member/member"
import { Otp } from "@/domain/entity/Otp/otp"

export default interface IMemberRepository {
    getMember(): Promise<Member>
    getMemberBalance(currencyId: string): Promise<number>
    updateLopd(acceptLopd: boolean, site: string, recaptchaAction: string, recaptchaToken: string): Promise<void>
    updateMember(
        memberSecurityUpdate: MemberSecurityUpdate,
        recaptchaAction: string,
        recaptchaToken: string
    ): Promise<Otp | null>
    validateOtpUpdateInformation(
        memberSecurityUpdate: MemberSecurityUpdate,
        recaptchaAction: string,
        recaptchaToken: string
    ): Promise<void>
}