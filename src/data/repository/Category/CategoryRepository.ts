
import ICategoryRepository from "@/domain/repository/Category/ICategoryRepository";
import "reflect-metadata"
import { injectable } from "inversify";
import { AlgoliaIndex } from "@/data/provider/algolia/types";
import AlgoliaClient from "@/data/provider/algolia/algoliaClient";

import { List } from "@/domain/entity/List/list";
import RepositoryBase from "../RepositoryBase";
import { Category, CategoryParams } from "@/domain/entity/Category/structure/category";
import { getCategoryAdapter } from "@/data/adapters/Category/categoryAdapter";

@injectable()
export default class CategoryRepository extends RepositoryBase implements ICategoryRepository {
    private readonly algoliaClient = new AlgoliaClient(AlgoliaIndex.CATEGORIES);

    async getCategories(params: CategoryParams): Promise<List<Category>> {
        const { isMainCategory, ...rest } = params
        const filters = isMainCategory ? `("_tags":"has_not_parent_slug") AND ("programCategories.programId":"${this.programId}")` : undefined;

        const { list } = await this.algoliaClient.search({
            params: {
                ...rest,
                programId: this.programId,
            },
            nameMap: {
                programId: 'programCategories.programId'
            },
            filters,
            adapter: getCategoryAdapter
        })

        return list
    }
}