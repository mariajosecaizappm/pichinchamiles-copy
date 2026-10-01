
import ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository";
import RepositoryBase from "../RepositoryBase";
import AlgoliaClient from "@/data/provider/algolia/algoliaClient";
import { AlgoliaIndex } from "@/data/provider/algolia/types";
import { List } from "@/domain/entity/List/list";
import { Campaign, CampaignListParams } from "@/domain/entity/Campaign/campaign";
import { getCampaignAdapter } from "@/data/adapters/Campaign/campaignAdapter";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export default class CampaignRepository extends RepositoryBase implements ICampaignRepository {
    private algoliaClient = new AlgoliaClient(AlgoliaIndex.MARKETING);
    async getCampaigns(params: CampaignListParams): Promise<List<Campaign>> {
        const { list } = await this.algoliaClient.search({
            params: {
                ...params,
                componentType: "campaign",
                programId: this.programId,
            },
            adapter: getCampaignAdapter,
            nameMap: {
                positions: "positions.name"
            }
        })

        return list
    }
}