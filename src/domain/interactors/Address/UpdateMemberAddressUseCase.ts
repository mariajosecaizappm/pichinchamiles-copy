import { inject, injectable } from "inversify"
import { Address } from "@/domain/entity/Address/structure/address"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes"
import type IAddressRepository from "@/domain/repository/Address/IAddressRepository"
import "reflect-metadata"

@injectable()
export default class UpdateMemberAddressUseCase {
    private addressRepository: IAddressRepository

    constructor(@inject(RepositoryTypes.AddressRepository) addressRepository: IAddressRepository) {
        this.addressRepository = addressRepository
    }

    updateMemberAddress(address: Address): Promise<void> {
        return this.addressRepository.updateMemberAddress(address)
    }
}
