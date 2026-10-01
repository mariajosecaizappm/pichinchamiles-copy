import {ProgramCurrency} from "@/domain/entity/Currency/currency";

export default interface ICurrencyRepository{
    getProgramCurrency(): Promise<ProgramCurrency>
}