import { Address } from "@/domain/entity/Address/structure/address"

export default interface IAddressRepository {
    getMemberAddresses(): Promise<Address[]>
    addMemberAddress(address: Address): Promise<void>
    updateMemberAddress(address: Address): Promise<void>
    deleteMemberAddress(addressId: string): Promise<void>
}
