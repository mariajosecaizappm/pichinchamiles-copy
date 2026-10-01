import {Member} from "@/domain/entity/Member/member";
import {ProgramCurrency} from "@/domain/entity/Currency/currency";
import {Basket} from "@/domain/entity/Basket/structure/basket";
import {Consent} from "@/domain/entity/Member/consent";

export type AuthMember = {
    member: Member
    balance: number
    currency: ProgramCurrency
    basket: Basket | null
    cif: string
    consent: Consent | null
}