import { List } from "@/domain/entity/List/list"
import { Requeriment, RequerimentType, RequerimentTypeListParams } from "@/domain/entity/Pqrs/requirement"


export default interface IRequirementRepository{
    getRequerimentTypes(params: RequerimentTypeListParams): Promise<List<RequerimentType>>
    createRequeriment(requeriment: Requeriment, recaptchaAction: string, recaptchaToken: string): Promise<void>
}