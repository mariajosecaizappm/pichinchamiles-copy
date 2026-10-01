"use client"

import React, { useContext } from "react";
import FormContext from "@/presentation/components/Form/context/FormContext";
import Counter from "@/presentation/components/Form/components/Counter";
import { cn } from "@heroui/react";
import { useProductDetailsContext } from "../../context/useProductDetailsContext";

type Props = {
    max: number;
    className?: string;
    countClassName?: string;
}

const ProductQuantity = ({ max, className, countClassName }: Props) => {
    const { values, setFieldValue } = useContext(FormContext)
    const { variation, isLoading } = useProductDetailsContext()
    const quantity = (values.quantity as number) || 1

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <p className="font-semibold text-sm leading-4">Cantidad</p>
            <Counter
                isReadonly={isLoading}
                min={1}
                max={variation?.stock || max}
                label="Cantidad"
                count={quantity}
                onChange={(val) => setFieldValue("quantity", val)}
                className="h-12 justify-between"
                countClassName={countClassName}
            />
        </div>
    );
};

export default ProductQuantity;