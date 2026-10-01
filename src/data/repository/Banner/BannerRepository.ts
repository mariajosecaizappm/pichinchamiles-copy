import { injectable } from "inversify";
import "reflect-metadata";
import RepositoryBase from "../RepositoryBase";
import IBannerRepository from "@/domain/repository/Banner/IBannerRepository";
import { Banner, BannerParams } from "@/domain/entity/Banner/banner";
import { getBannerAdapter } from "@/data/adapters/Banner/bannerAdapter";
import AlgoliaClient from "@/data/provider/algolia/algoliaClient";
import { AlgoliaIndex } from "@/data/provider/algolia/types";
import { List } from "@/domain/entity/List/list";

@injectable()
export default class BannerRepository
    extends RepositoryBase
    implements IBannerRepository
{
    private readonly algoliaClient = new AlgoliaClient(AlgoliaIndex.MARKETING);

    async getBanners(params: BannerParams): Promise<List<Banner>> {
        const { list } = await this.algoliaClient.search({
            params: {
                ...params,
                componentType: "banner",
                programId: this.programId,
            },
            adapter: getBannerAdapter,
            nameMap: {
                positions: "positions.name",
                category: "bannerCategory.slug"
            },
        });
        return list;
    }
}
