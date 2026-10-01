import { inject, injectable } from "inversify"
import { Address } from "@/domain/entity/Address/structure/address"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes"
import type IAddressRepository from "@/domain/repository/Address/IAddressRepository"
import "reflect-metadata"

@injectable()
export default class GetMemberAddressesUseCase {
    private addressRepository: IAddressRepository

    constructor(@inject(RepositoryTypes.AddressRepository) addressRepository: IAddressRepository) {
        this.addressRepository = addressRepository
    }

    getMemberAddresses(): Promise<Address[]> {
        return this.addressRepository.getMemberAddresses()
    }
}
