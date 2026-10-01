import { List } from "@/domain/entity/List/list"
import { Location, LocationsListParams } from "@/domain/entity/Location/structure/location"

export default interface ILocationRepository {
    getLocations(params: LocationsListParams): Promise<List<Location>>
}
