import AlgoliaClient from "@/data/provider/algolia/algoliaClient";
import { AlgoliaClientParams, AlgoliaIndex } from "@/data/provider/algolia/types";
import RepositoryBase from "@/data/repository/RepositoryBase";
import { List } from "@/domain/entity/List/list";
import { Brand, BrandParams } from "@/domain/entity/Brand/brand";
import IBrandRepository from "@/domain/repository/Brand/IBrandRepository";
import { injectable } from "inversify";
import "reflect-metadata"


@injectable()
export default class BrandRepository extends RepositoryBase implements IBrandRepository {
    private readonly algoliaClient = new AlgoliaClient(AlgoliaIndex.BRANDS);

    async getBrands(params: BrandParams): Promise<List<Brand>> {
        const { list } = await this.algoliaClient.search({
            params: params as unknown as AlgoliaClientParams,
            adapter: (item: unknown) => item as Brand
        })

        return list
    }
}