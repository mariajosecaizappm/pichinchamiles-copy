import { injectable } from "inversify"
import { Address } from "@/domain/entity/Address/structure/address"
import IAddressRepository from "@/domain/repository/Address/IAddressRepository"
import { getAddressesAdapter, updateAddressAdapter } from "@/data/adapters/Address/addressAdapter"
import axPrivate from "@/data/provider/axios/axiosPrivate"
import RepositoryBase from "@/data/repository/RepositoryBase"
import "reflect-metadata"

@injectable()
export default class AddressRepository extends RepositoryBase implements IAddressRepository {
    async getMemberAddresses(): Promise<Address[]> {
        const url = `${this.identityPrefix}/${this.programId}/users/members/addresses`
        const {
            data: { entities },
        } = await axPrivate.get(url)
        return getAddressesAdapter(entities)
    }

    async addMemberAddress(address: Address): Promise<void> {
        const url = `${this.identityPrefix}/${this.programId}/users/members/addresses`
        const payload = updateAddressAdapter(address)
        await axPrivate.post(url, payload)
    }

    async updateMemberAddress(address: Address): Promise<void> {
        const url = `${this.identityPrefix}/${this.programId}/users/members/addresses/${address.id}`
        const payload = updateAddressAdapter(address)
        await axPrivate.put(url, payload)
    }

    async deleteMemberAddress(addressId: string): Promise<void> {
        const url = `${this.identityPrefix}/${this.programId}/users/members/addresses/${addressId}`
        await axPrivate.delete(url)
    }
}
