import { Location } from "@/domain/entity/Location/structure/location"

export const getLocationsAdapter = (hitValue: Record<string, unknown>): Location => ({
    id: hitValue.id as string,
    name: hitValue.name as string,
    grade: hitValue.grade as Location["grade"],
    availableForDelivery: hitValue.availableForDelivery as boolean,
    parentId: hitValue.parentId as string,
})
