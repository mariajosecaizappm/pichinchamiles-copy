"use client"
import { useQuery } from "@tanstack/react-query"
import container from "@/presentation/config/inversify.config"
import GetMemberAddressesUseCase from "@/domain/interactors/Address/GetMemberAddressesUseCase"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import { Address } from "@/domain/entity/Address/structure/address"
import AddressModal from "@/presentation/components/Modal/AddressModal/AddressModal"
import { useModal } from "@/presentation/components/Modal"
import { addressFormInitialValues } from "@/presentation/forms/AddressForm/AddressFormConfig"
import { addressToFormValues } from "@/presentation/forms/AddressForm/formatData"
import LimitAdressesModal from "../pages/Profile/Addresses/LimitAdressesModal"

const MAX_ADDRESSES = 10

type Config = {
    fetchOnMount?: boolean
}

const useAddress = (config?: Config) => {
    const { openModal, closeModal } = useModal()
    const getAddressUseCase = container.get<GetMemberAddressesUseCase>(
        UseCaseTypes.GetMemberAddressesUseCase
    )
    const { data: addresses, isLoading, refetch } = useQuery({
        queryKey: ["address"],
        queryFn: () => getAddressUseCase.getMemberAddresses(),
        refetchOnWindowFocus: false,
        enabled: config?.fetchOnMount || false,
    })

    const closeAddressModal = () => {
        closeModal()
    }

    const onAddAddress = () => {
        if (addresses && addresses.length >= MAX_ADDRESSES) {
            openModal(LimitAdressesModal)
            return
        }
        openModal(AddressModal, {
            address: { ...addressFormInitialValues },
            title: "Agregar dirección",
            submitText: "Agregar dirección",
        })
    }

    const onEditAddress = (address: Address) => {
        openModal(AddressModal, {
            address: addressToFormValues(address),
            title: "Editar dirección de envío",
            submitText: "Guardar dirección",
        })
    }

    return {
        isLoadingAddresses: isLoading,
        addresses: addresses || [],
        onAddAddress,
        onEditAddress,
        closeAddressModal,
        refetchAddresses: refetch,
    }
}

export default useAddress
