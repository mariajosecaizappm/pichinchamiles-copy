"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Address } from "@/domain/entity/Address/structure/address"
import { MemberType } from "@/domain/entity/Member/member"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import GetMemberAddressesUseCase from "@/domain/interactors/Address/GetMemberAddressesUseCase"
import { FormRef } from "@/presentation/components/Form/context/Form"
import container from "@/presentation/config/inversify.config"
import useSession from "@/presentation/hooks/useSession"
import { AddressFormValues } from "@/presentation/forms/AddressForm/AddressFormConfig"
import { formatBillingAddress } from "@/presentation/helpers/formatBillingAddress"

const getAddressUseCase = container.get<GetMemberAddressesUseCase>(
    UseCaseTypes.GetMemberAddressesUseCase
)

export type UseShoppingCartAddressReturn = {
    addressList: Address[]
    selectedAddress: AddressFormValues | null
    shippingAddress: Address | null
    billingAddress: Address | null
    memberType: MemberType
    isLoadingAddresses: boolean
    billingFormRef: React.RefObject<FormRef | null>
    setSelectedAddress: (address: AddressFormValues | null) => void
    selectShippingAddress: (address: Address) => void
    setBillingAddress: (address: Address | null) => void
    getAddress: () => Promise<void>
}

export const useShoppingCartAddress = (step: number): UseShoppingCartAddressReturn => {
    const { member } = useSession()
    const billingFormRef = useRef<FormRef | null>(null)
    const [selectedAddress, setSelectedAddress] = useState<AddressFormValues | null>(null)
    const [addressList, setAddressList] = useState<Address[]>([])
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
    const [billingAddress, setBillingAddress] = useState<Address | null>(null)
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

    const memberType = member?.memberType ?? MemberType.PERSONAL

    const enrollmentEmail =
        member && "enrollmentEmail" in member ? member.enrollmentEmail : ""

    const getAddress = useCallback(async () => {
        setIsLoadingAddresses(true)
        try {
            const addresses = await getAddressUseCase.getMemberAddresses()
            setAddressList(addresses)
        } catch {
            setAddressList([])
        } finally {
            setIsLoadingAddresses(false)
        }
    }, [])

    useEffect(() => {
        if (step === 2) {
            getAddress()
        }
    }, [step, getAddress])

    useEffect(() => {
        if (addressList.length === 0) return

        setShippingAddress(prev => {
            if (prev) {
                const updated = addressList.find(address => address.id === prev.id)
                return updated
                    ? { ...updated, customerReceivingEmail: enrollmentEmail }
                    : prev
            }

            const defaultAddress = addressList.find(address => address.default) ?? addressList[0]
            return { ...defaultAddress, customerReceivingEmail: enrollmentEmail }
        })
    }, [addressList, enrollmentEmail])

    useEffect(() => {
        if (!member || !shippingAddress) return

        setBillingAddress(prev => {
            if (!prev || prev.id !== shippingAddress.id) {
                return formatBillingAddress(member, shippingAddress)
            }
            return prev
        })
    }, [member, shippingAddress])

    const selectShippingAddress = useCallback(
        (address: Address) => {
            setShippingAddress({ ...address, customerReceivingEmail: enrollmentEmail })
        },
        [enrollmentEmail]
    )

    return {
        addressList,
        selectedAddress,
        shippingAddress,
        billingAddress,
        memberType,
        isLoadingAddresses,
        billingFormRef,
        setSelectedAddress,
        selectShippingAddress,
        setBillingAddress,
        getAddress,
    }
}
