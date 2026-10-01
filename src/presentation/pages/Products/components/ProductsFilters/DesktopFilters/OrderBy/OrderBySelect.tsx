"use client"

import { Select } from "@/presentation/components/Form/components/Select";
import { SelectItem, SharedSelection } from "@heroui/react";
import { ORDER_BY_OPTIONS } from "../../ProductsFiltersConfig";

type Props = {
    orderBy: string | null;
    onSelectionChange: (keys: SharedSelection) => void;
    isPending?: boolean;
}

const OrderBySelect = ({ orderBy, isPending = false, onSelectionChange }: Props) => {

    return (
        <Select
            name="sort"
            disabled={isPending}
            selectionMode="single"
            selectedKeys={orderBy ? [orderBy] : []}
            placeholder="Ordenar por"
            onSelectionChange={onSelectionChange}
        >
            {ORDER_BY_OPTIONS.map((option) => (
                <SelectItem
                    aria-label={option.label}
                    key={option.value}>
                    {option.label}
                </SelectItem>
            ))}
        </Select>
    )
}

export default OrderBySelect