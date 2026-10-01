import {injectable} from "inversify";
import RepositoryBase from "@/data/repository/RepositoryBase";
import ICurrencyRepository from "@/domain/repository/Currency/ICurrencyRepository";
import {ProgramCurrency} from "@/domain/entity/Currency/currency";
import axPrivate from "@/data/provider/axios/axiosPrivate";
import {programCurrencyAdapter} from "@/data/adapters/Currency/currencyAdapter";

@injectable()
export default class CurrencyRepository extends RepositoryBase implements ICurrencyRepository{
    async getProgramCurrency(): Promise<ProgramCurrency> {
        const { data } = await axPrivate.get(`${this.programsPrefix}/${this.programId}/currencies`);
        return programCurrencyAdapter(data);
    }
}