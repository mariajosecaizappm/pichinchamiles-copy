import { inject, injectable } from "inversify"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes"
import type IAddressRepository from "@/domain/repository/Address/IAddressRepository"
import "reflect-metadata"

@injectable()
export default class DeleteMemberAddressUseCase {
    private addressRepository: IAddressRepository

    constructor(@inject(RepositoryTypes.AddressRepository) addressRepository: IAddressRepository) {
        this.addressRepository = addressRepository
    }

    deleteMemberAddress(addressId: string): Promise<void> {
        return this.addressRepository.deleteMemberAddress(addressId)
    }
}
