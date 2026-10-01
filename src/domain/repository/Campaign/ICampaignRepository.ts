

import { Campaign, CampaignListParams } from "@/domain/entity/Campaign/campaign";
import { List } from "@/domain/entity/List/list";


export default interface ICampaignRepository {
    getCampaigns(params: CampaignListParams): Promise<List<Campaign>>

}