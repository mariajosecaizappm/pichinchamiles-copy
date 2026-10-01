import { getVariationAdapter } from "@/data/adapters/Variation/variationAdapter";
import AlgoliaClient from "@/data/provider/algolia/algoliaClient";
import { AlgoliaIndex } from "@/data/provider/algolia/types";
import { Variation, VariationListParams } from "@/domain/entity/Product/variation";
import IVariationRepository from "@/domain/repository/Variation/IVariationRepository";
import { injectable } from "inversify";
import RepositoryBase from "../RepositoryBase";


@injectable()
export default class VariationRepository extends RepositoryBase implements IVariationRepository {
    private algoliaClient = new AlgoliaClient(AlgoliaIndex.VARIATIONS);
    async getVariations(params: VariationListParams): Promise<Variation[]> {
        const { list } = await this.algoliaClient.search({
            params: {
                ...params,
                programId: this.programId
            },
            adapter: getVariationAdapter
        })

        return list.data
    }
}