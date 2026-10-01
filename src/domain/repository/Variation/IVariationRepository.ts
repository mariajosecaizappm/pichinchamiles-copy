import { Variation, VariationListParams } from "@/domain/entity/Product/variation";

export default interface IVariationRepository {
    getVariations(params: VariationListParams): Promise<Variation[]>
}