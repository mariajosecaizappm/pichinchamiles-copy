"use client"

import { Brand } from "@/domain/entity/Brand/brand"
import { Radio } from "@/presentation/components/Form/components/Radio"
import { Divider, RadioGroup, Skeleton } from "@heroui/react"
import { type PointerEvent } from "react"
import FilterAccordion from "../../FilterAccordion"
import { DEFAULT_BRANDS_TO_SHOW } from "../../ProductsFiltersConfig"
import ShowAllFilters from "../../MobileFilters/Brands/ShowAllFilters"

type Props = {
    isLoading: boolean;
    brands: Brand[];
    showAllBrands: boolean;
    currentBrand: string;
    onCheckBrand: (value: string) => void;
    setShowAllBrands: (value: boolean) => void;
    isPending?: boolean,
    onPressBrand: (e: PointerEvent<HTMLDivElement>, brand: string) => void
    onAccordionOpenChange?: (isOpen: boolean) => void
}

const BrandFilter = ({
    isLoading,
    brands,
    showAllBrands,
    currentBrand,
    onCheckBrand,
    setShowAllBrands,
    onPressBrand,
    isPending = false,
    onAccordionOpenChange
}: Props) => {

    return (
        <>
            <Divider className="bg-darkGrayishBlue-300" />
            <FilterAccordion className="px-4" title="Marcas" onExpandedChange={onAccordionOpenChange}>
                {isLoading ? (
                    <div className="">
                        {Array.from({ length: DEFAULT_BRANDS_TO_SHOW / 2 }).map((_, index) => {
                            const key = `skeleton-brand-${index}`
                            return (
                                <div key={key} className="w-full h-12 flex items-center gap-2">
                                    <div className="h-full w-12 flex items-center justify-center">
                                        <Skeleton className="w-5 h-5 rounded-full" />
                                    </div>
                                    <Skeleton className="w-24 h-4 rounded-sm" />
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div
                        data-collapsed={showAllBrands}
                        className={"w-full h-full overflow-y-auto max-h-153"}>
                        <RadioGroup
                            isDisabled={isPending}
                            value={currentBrand}
                            onValueChange={onCheckBrand}
                            classNames={{
                                wrapper: "gap-2"
                            }}
                        >
                            {
                                brands.slice(0, showAllBrands ? brands.length : DEFAULT_BRANDS_TO_SHOW)
                                    .map((brand) => (
                                        <div
                                            key={brand.id}
                                            className="w-full"
                                            onPointerDownCapture={(event) => onPressBrand(event, brand.id)}
                                        >
                                            <Radio value={brand.id}>
                                                {brand.name}
                                            </Radio>
                                        </div>
                                    ))
                            }
                            {
                                brands.length > DEFAULT_BRANDS_TO_SHOW && (
                                    <ShowAllFilters showAll={showAllBrands} setShowAll={setShowAllBrands} />
                                )
                            }
                        </RadioGroup>
                    </div>
                )}
            </FilterAccordion>
        </>
    )
}

export default BrandFilter