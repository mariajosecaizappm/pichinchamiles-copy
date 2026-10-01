/* eslint-disable @typescript-eslint/no-explicit-any */
import {ProgramCurrency} from "@/domain/entity/Currency/currency";

export const programCurrencyAdapter = (data: any): ProgramCurrency =>{
    const pointsCurrency = data.entities.find((entity: any) => entity.type === "points" && entity.priority === 1);
    const coinsCurrency = data.entities.find((entity: any) => entity.type === "coin" && entity.priority === 1);

    if(pointsCurrency && coinsCurrency){
        return {
            pointsCurrencyId: pointsCurrency.currencyId,
            coinsCurrencyId: coinsCurrency.currencyId
        };
    }else{
        throw new Error('currency not configured')
    }
}