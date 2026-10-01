import { inject, injectable } from "inversify"
import { StringComparator } from "@/domain/entity/List/list"
import { Location, LocationGrade, LocationQuery } from "@/domain/entity/Location/structure/location"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes"
import type ILocationRepository from "@/domain/repository/Location/ILocationRepository"
import "reflect-metadata"

@injectable()
export default class GetLocationsUseCase {
    private locationRepository: ILocationRepository

    constructor(@inject(RepositoryTypes.LocationRepository) locationRepository: ILocationRepository) {
        this.locationRepository = locationRepository
    }

    async getLocation(params: LocationQuery): Promise<Location[]> {
        const locations = await this.locationRepository.getLocations({
            query: { value: params.query },
            grade: params.grade,
            page: 1,
            pageSize: 300,
            availableForDelivery: true,
        })
        return locations.data
    }

    async getLocations(
        parentId: string,
        grade: LocationGrade,
        inputValue: string,
        availableForDelivery?: boolean,
    ): Promise<Location[]> {
        const locationsList = await this.locationRepository.getLocations({
            name: inputValue
                ? { value: inputValue, comparator: StringComparator.CONTAINS }
                : undefined,
            grade,
            parentId,
            page: 1,
            pageSize: 300,
            ...(availableForDelivery !== undefined ? { availableForDelivery } : {}),
        })
        return locationsList.data
    }
}
