"use client"

import { Icon } from "@iconify/react"
import clsx from "clsx"
import { Address } from "@/domain/entity/Address/structure/address"
import Radio from "@/presentation/components/Form/components/Radio/Radio"
import {
    LIMIT_MASKED_IDENTIFICATION,
    maskedData,
    maskedPhone,
} from "@/presentation/helpers/member"
import { toTitleCase } from "@/presentation/helpers/text"

type ShoppingCartAddressCardProps = {
    address: Address
    isSelected: boolean
    onEdit: () => void
    onDelete?: () => void
    isDisabled?: boolean
}

const ShoppingCartAddressCard = ({
    address,
    isSelected,
    onEdit,
    onDelete,
    isDisabled,
}: ShoppingCartAddressCardProps) => {
    return (
        <div className="flex gap-5">
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-5 text-grayscale-500 break-words">{address.alias}</p>
                <p className="text-lg font-semibold leading-6 text-grayscale-700 break-words">
                    {address.street1} {address.number} {address.street2}
                </p>
                <p className="text-sm leading-5 text-grayscale-400 break-words">{address.reference}</p>
                <p className="text-sm leading-5 text-grayscale-400">
                    {toTitleCase(address.state.name)}, {toTitleCase(address.city.name)}
                </p>
                <p className="text-sm leading-5 text-grayscale-400">
                    Teléfono: {maskedPhone(address.secondPhone)}
                </p>
                {address.isThirdPartyAddress ? (
                    <div>
                        <p className="text-sm font-medium leading-5 text-grayscale-500">
                            Un tercero recibe los productos
                        </p>
                        <p className="text-lg font-semibold leading-6 text-grayscale-700">Recibe</p>
                        <p className="text-sm leading-5 text-grayscale-400 break-words">
                            {address.customerReceivingFirstName}{" "}
                            {address.customerReceivingLastName}
                        </p>
                        <p className="text-sm leading-5 text-grayscale-400">
                            {address.customerReceivingIdentificationType}:{" "}
                            {maskedData(
                                address.customerReceivingIdentificationNumber || "",
                                0,
                                LIMIT_MASKED_IDENTIFICATION,
                            )}
                        </p>
                        <p className="text-sm leading-5 text-grayscale-400">
                            Teléfono:{" "}
                            {maskedPhone(address.customerReceivingPhone)}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm font-medium leading-5 text-grayscale-500">
                        Tú recibes el producto
                    </p>
                )}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-4 justify-between">
                <div
                    className={clsx(
                        "flex size-10 items-center justify-center rounded-sm",
                        isSelected && "bg-darkGrayishBlue-100"
                    )}
                >
                    <Radio
                        value={address.id}
                        aria-label={`Seleccionar ${address.alias}`}
                        classNames={{
                            base: "m-0 flex h-full w-full items-center justify-center p-0",
                            wrapper:
                                "m-0 h-5 w-5 min-w-5 border border-grayscale-400 group-data-[hover-unselected=true]:bg-white group-data-[selected=true]:border-information-500 group-data-[selected=true]:bg-information-500",
                            control: "h-2 w-2 bg-white",
                            labelWrapper: "m-0 hidden max-h-0 max-w-0 overflow-hidden p-0",
                            label: "hidden",
                        }}
                    />
                </div>
                <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2.5">
                    <button
                        type="button"
                        onClick={onEdit}
                        disabled={isDisabled}
                        aria-label={`Editar ${address.alias}`}
                        className="flex size-10 items-center justify-center rounded-sm border border-blue-500 text-blue-500 transition-colors hover:bg-darkGrayishBlue-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Icon icon="mdi:pencil-outline" className="size-5" />
                    </button>
                    {onDelete ? (
                        <button
                            type="button"
                            onClick={onDelete}
                            disabled={isDisabled}
                            aria-label={`Eliminar ${address.alias}`}
                            className="flex size-10 items-center justify-center rounded-sm bg-blue-500 text-white transition-colors hover:bg-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Icon icon="mdi:delete-outline" className="size-5" />
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default ShoppingCartAddressCard
