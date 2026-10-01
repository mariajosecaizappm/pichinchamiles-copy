import { Address } from "@/domain/entity/Address/structure/address"

export const sortAddressesNewestFirst = (addresses: Address[]): Address[] => {
    const hasDates = addresses.some(address => Boolean(address.createdAt))

    if (!hasDates) {
        return [...addresses].reverse()
    }

    return [...addresses].sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0
        return bTime - aTime
    })
}

/** Hide trash when only 1 address total, or when deleting would remove the last personal address. */
export const canDeleteAddress = (address: Address, addresses: Address[]): boolean => {
    if (addresses.length <= 1) return false

    if (!address.isThirdPartyAddress) {
        const personalCount = addresses.filter(item => !item.isThirdPartyAddress).length
        if (personalCount <= 1) return false
    }

    return true
}
