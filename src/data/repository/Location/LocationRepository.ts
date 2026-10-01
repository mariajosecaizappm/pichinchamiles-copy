import { injectable } from "inversify"
import { getLocationsAdapter } from "@/data/adapters/Location/locationsAdapter"
import AlgoliaClient from "@/data/provider/algolia/algoliaClient"
import { AlgoliaClientParams, AlgoliaIndex } from "@/data/provider/algolia/types"
import { List } from "@/domain/entity/List/list"
import { Location, LocationsListParams } from "@/domain/entity/Location/structure/location"
import ILocationRepository from "@/domain/repository/Location/ILocationRepository"
import RepositoryBase from "@/data/repository/RepositoryBase"
import "reflect-metadata"

@injectable()
export default class LocationRepository extends RepositoryBase implements ILocationRepository {
    private readonly algoliaClient = new AlgoliaClient(AlgoliaIndex.LOCATIONS)

    async getLocations(params: LocationsListParams): Promise<List<Location>> {
        const { list } = await this.algoliaClient.search({
            params: params as AlgoliaClientParams,
            adapter: getLocationsAdapter,
        })
        return list
    }
}
