"use client"

import { Icon } from "@iconify/react"
import { Address } from "@/domain/entity/Address/structure/address"
import { Divider, RadioGroup } from "@heroui/react"
import ShoppingCartAddressCard from "./ShoppingCartAddressCard"

type ShoppingCartShippingAddressProps = {
    addresses: Address[]
    shippingAddress: Address | null
    isLoadingAddresses: boolean
    onAddAddress: () => void
    onSelectAddress: (address: Address) => void
    onEditAddress: (address: Address) => void
}

const ShoppingCartShippingAddress = ({
    addresses,
    shippingAddress,
    isLoadingAddresses,
    onAddAddress,
    onSelectAddress,
    onEditAddress
}: ShoppingCartShippingAddressProps) => {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-[32px] font-semibold leading-[38px] text-blue-500">
                    Dirección de envío
                </h1>
                <p className="mt-1 text-lg font-semibold leading-6 text-grayscale-500">
                    Elige la dirección a la que deseas enviar tus productos.
                </p>
            </div>

            <div className="rounded-lg border border-grayscale-300 bg-white p-4">
                {isLoadingAddresses ? (
                    <div className="h-32 animate-pulse bg-darkGrayishBlue-100" />
                ) : (
                    <RadioGroup
                        value={shippingAddress?.id ?? ""}
                        onValueChange={value => {
                            const address = addresses.find(item => item.id === value)
                            if (address) onSelectAddress(address)
                        }}
                        classNames={{ wrapper: "gap-5 flex-nowrap" }}
                    >
                        {addresses.map((address) => (
                            <div key={address.id}>
                                <ShoppingCartAddressCard
                                    address={address}
                                    isSelected={shippingAddress?.id === address.id}
                                    onEdit={() => onEditAddress(address)}
                                />
                                <Divider className="mt-2.5 bg-darkGrayishBlue-300" />
                            </div>
                        ))}
                    </RadioGroup>
                )}
                <button
                    type="button"
                    onClick={onAddAddress}
                    disabled={isLoadingAddresses}
                    className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-darkGrayishBlue-300 bg-darkGrayishBlue-200 px-4 text-sm font-semibold leading-6 text-blue-500 transition-colors hover:bg-darkGrayishBlue-100 disabled:cursor-not-allowed disabled:opacity-50 w-full md:max-w-[284px]"
                >
                    <Icon icon="mdi:plus" className="size-5" />
                    Agregar nueva dirección
                </button>
            </div>
        </div>
    )
}

export default ShoppingCartShippingAddress
