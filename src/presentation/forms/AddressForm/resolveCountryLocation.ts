import { Location, LocationGrade } from "@/domain/entity/Location/structure/location"

export const normalizeLocationName = (value: string): string =>
    value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim()
        .toUpperCase()

export const resolveCountryLocation = (
    locations: Location[],
    query: string,
): Location | null => {
    const normalizedQuery = normalizeLocationName(query)
    if (!normalizedQuery) return null

    const countries = locations.filter(location => location.grade === LocationGrade.COUNTRY)
    if (countries.length === 0) return null

    const exactMatch = countries.find(
        location => normalizeLocationName(location.name) === normalizedQuery,
    )
    if (exactMatch) return exactMatch

    const startsWithMatch = countries.find(location =>
        normalizeLocationName(location.name).startsWith(normalizedQuery),
    )
    if (startsWithMatch) return startsWithMatch

    const queryStartsWithName = countries.find(location =>
        normalizedQuery.startsWith(normalizeLocationName(location.name)),
    )
    if (queryStartsWithName) return queryStartsWithName

    return null
}
