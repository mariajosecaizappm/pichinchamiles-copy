import { Address } from "@/domain/entity/Address/structure/address"
import { Button } from "@/presentation/components/Form/components/Button"
import ShoppingCartAddressCard from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartShippingAddress/ShoppingCartAddressCard"
import { Divider, RadioGroup } from "@heroui/react"
import { Icon } from "@iconify/react"
import { Fragment } from "react"
import { canDeleteAddress, sortAddressesNewestFirst } from "./utils"

type Props = {
    addresses: Address[]
    shippingAddress: Address | null
    onSelectAddress: (address: Address) => void
    onEditAddress: (address: Address) => void
    onDeleteAddress: (address: Address) => void
    isDisabled?: boolean
    onAddAddress: () => void
    isLoadingAddresses?: boolean
}

const Addresses = ({
    addresses,
    shippingAddress,
    onSelectAddress,
    onEditAddress,
    onDeleteAddress,
    isDisabled,
    onAddAddress,
    isLoadingAddresses,
}: Props) => {
    const sortedAddresses = sortAddressesNewestFirst(addresses)
    const personalAddresses = sortedAddresses.filter((address) => !address.isThirdPartyAddress)
    const thirdPartyAddresses = sortedAddresses.filter((address) => address.isThirdPartyAddress)

    return (
        <div className="body-container pt-3 pb-6 space-y-3 md:max-w-[888px]">
            <h2 className="font-slab text-[22px] leading-7 text-blue-500">
                Mis direcciones
            </h2>
            {
                sortedAddresses.length > 0 ? (
                    <RadioGroup
                        value={shippingAddress?.id ?? ""}
                        onValueChange={value => {
                            const address = sortedAddresses.find(item => item.id === value)
                            if (address) onSelectAddress(address)
                        }}
                        classNames={{ wrapper: "gap-3 flex-nowrap" }}
                        isDisabled={isDisabled}
                        isRequired
                    >
                        {personalAddresses.map((address) => {
                            const isSelected = address.id === shippingAddress?.id
                            const showDelete = canDeleteAddress(address, addresses)
                            return (
                                <Fragment key={address.id}>
                                    <ShoppingCartAddressCard
                                        address={address}
                                        isSelected={isSelected}
                                        onEdit={() => onEditAddress(address)}
                                        onDelete={showDelete ? () => onDeleteAddress(address) : undefined}
                                        isDisabled={isDisabled}
                                    />
                                    <div className="py-2">
                                        <Divider />
                                    </div>
                                </Fragment>
                            )
                        })}
                        {
                            thirdPartyAddresses.length > 0 && (
                                <>
                                    <h2 className="font-slab text-[22px] leading-7 text-blue-500">
                                        Direcciones de terceros
                                    </h2>

                                    {thirdPartyAddresses.map((address, index) => {
                                        const isSelected = address.id === shippingAddress?.id
                                        const showDelete = canDeleteAddress(address, addresses)
                                        return (
                                            <Fragment key={address.id}>
                                                <ShoppingCartAddressCard
                                                    address={address}
                                                    isSelected={isSelected}
                                                    onEdit={() => onEditAddress(address)}
                                                    onDelete={showDelete ? () => onDeleteAddress(address) : undefined}
                                                    isDisabled={isDisabled}
                                                />
                                                {
                                                    index < thirdPartyAddresses.length - 1 && (
                                                        <div className="py-2">
                                                            <Divider />
                                                        </div>
                                                    )
                                                }
                                            </Fragment>
                                        )
                                    })}
                                </>
                            )
                        }

                    </RadioGroup>
                ) : (
                    <div className="flex flex-col justify-center items-center text-center gap-4">
                        <div className="rounded-full bg-information-50 w-17 h-17 flex items-center justify-center">
                            <Icon icon="ic:round-info" className="h-10 w-10 text-information-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-blue-500 text-[28px] font-slab font-semibold leading-normal">No hay direcciones registradas</p>
                            <p>Puedes agregar una dirección en donde dejaremos tu producto </p>
                        </div>
                    </div>
                )
            }
            <Button
                color="secondary"
                onPress={onAddAddress}
                disabled={isLoadingAddresses}
                startContent={<Icon icon="mdi:plus" className="size-5" />}>
                Agregar nueva dirección
            </Button>
        </div>
    )
}

export default Addresses
