"use client";

import React, { useContext } from "react";
import FormContext from "@/presentation/components/Form/context/FormContext";
import { ProductFeature } from "@/domain/entity/Product/product";
import { Select } from "@/presentation/components/Form/components/Select";
import { SelectItem } from "@heroui/react";
import { useProductDetailsContext } from "../../context/useProductDetailsContext";

type Props = {
    feature: ProductFeature;
    isInvalid?: boolean;
    onChanged?: () => void;
}

const ProductVariantSelector = ({ feature, isInvalid, onChanged }: Props) => {
    const { values, setFieldValue } = useContext(FormContext)
    const { isLoading } = useProductDetailsContext()

    const featuresMap = (values.features || {}) as Record<string, string>
    const selectedOption = featuresMap[feature.name] || ""

    return (
        <Select
            isInvalid={isInvalid}
            name={feature.name}
            selectedKeys={[selectedOption]}
            selectionMode="single"
            isDisabled={feature.options.length === 1 || isLoading}
            label={feature.name}
            className="**:first-letter:uppercase"
            classNames={{
                value: feature.name === "talla" ? "uppercase" : "first-letter:uppercase",
                listbox: feature.name === "talla" ? "uppercase" : "**:first-letter:uppercase",
            }}
            onSelectionChange={(keys) => {
                const option = keys.currentKey as string | null;
                if (!option) return;
                onChanged?.();
                setFieldValue(`features.${feature.name}`, option)
            }}
        >
            {feature.options.map((option) => (
                <SelectItem key={option}>
                    {option}
                </SelectItem>
            ))}
        </Select>
    );
};

export default ProductVariantSelector;