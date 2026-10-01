import IMemberRepository from "@/domain/repository/Member/IMemberRepository"
import RepositoryBase from "@/data/repository/RepositoryBase"
import { Member, MemberSecurityUpdate } from "@/domain/entity/Member/member"
import axPrivate from "@/data/provider/axios/axiosPrivate"
import { memberInformationAdapter, memberOtpInformationAdapter } from "@/data/adapters/Member/memberAdapter"
import { injectable } from "inversify"
import {Otp} from "@/domain/entity/Otp/otp";
import {getOtp} from "@/data/adapters/Auth/authAdapters";

@injectable()
export default class MemberRepository extends RepositoryBase implements IMemberRepository {
    async getMember(): Promise<Member> {
        const { data } = await axPrivate.get(`${this.identityPrefix}/${this.programId}/users/members/me`);
        return memberInformationAdapter(data)
    }

    async getMemberBalance(currencyId: string): Promise<number> {
        const { data } = await axPrivate.get(`${this.pointsTransactionsPrefix}/${this.programId}/users/members/balances/${currencyId}`)
        return data.total
    }

    async updateLopd(acceptLopd: boolean, site: string, recaptchaAction: string, recaptchaToken: string): Promise<void>{
        await axPrivate.post(`${this.identityPrefix}/${this.programId}/users/members/lopd`, {
            acceptLopd,
            site,
        },
        {
            headers: {
                "Recaptchaaction": recaptchaAction,
                "Recaptchatoken": recaptchaToken
            }
        })
    }

    async validateOtpUpdateInformation(
        memberSecurityUpdate: MemberSecurityUpdate,
        recaptchaAction: string,
        recaptchaToken: string
    ): Promise<void> {
        const url = `${this.identityPrefix}/${this.programId}/users/members/me/validate-otp`
        const payload = memberOtpInformationAdapter(memberSecurityUpdate)
        await axPrivate.post(url, payload, {
            headers: {
                Recaptchaaction: recaptchaAction,
                Recaptchatoken: recaptchaToken,
            },
        })
    }

    async updateMember(
        memberSecurityUpdate: MemberSecurityUpdate,
        recaptchaAction: string,
        recaptchaToken: string
    ): Promise<Otp | null> {
        const url = `${this.identityPrefix}/${this.programId}/users/members/me`
        const { data } = await axPrivate.patch(url, memberSecurityUpdate, {
            headers: {
                Recaptchaaction: recaptchaAction,
                Recaptchatoken: recaptchaToken,
            },
        })
        return getOtp(data)
    }
}
