import {Consent, ConsentRegister} from "@/domain/entity/Member/consent";

export default interface IApigeeRepository {
    getCif(): Promise<string | null>
    getConsent(cif: string): Promise<Consent | null>
    updateConsent(consentRegister: ConsentRegister): Promise<void>
}