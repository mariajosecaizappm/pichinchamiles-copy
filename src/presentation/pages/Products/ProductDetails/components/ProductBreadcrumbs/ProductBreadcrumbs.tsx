"use client"

import { ProductCategory } from "@/domain/entity/Product/product";
import { Button } from "@/presentation/components/Form/components/Button";
import links from "@/presentation/config/links";
import ArrowIcon from "@/presentation/pages/Home/components/Header/components/Menu/components/Icons/ArrowIcon";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, cn } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategoryHref } from "./ProductBreadcrumbsConfig";
import ProductBreadcrumbInitializer
    from "@/presentation/pages/Products/ProductDetails/components/ProductBreadcrumbs/ProductBreadcrumbInitializer";

type Props = {
    categories: ProductCategory[] | undefined,
    productName: string
}
const Separator = () => <span className="shrink-0">/</span>;

const ProductBreadcrumbs = ({ categories, productName }: Props) => {
    const router = useRouter();
    const middleCategories = categories?.slice(1) || [];

    return (
        <div className="flex gap-4 text-grayscale-400 items-center leading-6 w-full">
            <ProductBreadcrumbInitializer categories={categories ?? []}/>
            <button
                className="rotate-180 h-6 min-w-6 cursor-pointer shrink-0"
                onClick={() => router.back()}
            >
                <span className="flex items-center justify-center">
                    <ArrowIcon />
                </span>
            </button>
            <div className="flex gap-2 text-sm items-center min-w-0 flex-1 overflow-hidden">
                {/* Root category – always visible - only on desktop */}
                <Link
                    className={cn("truncate shrink min-w-0 hover:text-information-500 hover:underline underline-offset-3", {
                        "hidden lg:block": categories?.length && categories.length > 1
                    })}
                    href={links.productsList}
                >
                    Home
                </Link>
                {
                    categories?.length && categories.length > 0 ? (
                        <>
                            <span className={cn("", {
                                "hidden lg:block": categories?.length && categories.length > 1
                            })}>
                                <Separator />
                            </span>
                            <Link
                                className="truncate shrink min-w-0 max-w-[120px] sm:max-w-[160px] hover:text-information-500 hover:underline underline-offset-3"
                                href={getCategoryHref(categories || [], 0)}
                            >
                                {categories[0].name}
                            </Link>
                        </>
                    ) : null
                }

                {middleCategories.length > 0 && (
                    <>
                        <Separator />

                        {/* Mobile: collapsed dropdown for all middle categories */}
                        <div className="lg:hidden flex items-center gap-1 shrink-0">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="flex items-center gap-2 min-w-5 h-4 px-0.5"
                                        variant="light"
                                        isIconOnly
                                    >
                                        <span>...</span>
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    {middleCategories.map((category, idx) => {
                                        const key = `${category.slug}-${idx}`;
                                        return (
                                            <DropdownItem
                                                classNames={{
                                                    base: [
                                                        "outline-none",
                                                        "data-[focus-visible=true]:outline-none",
                                                        "data-[focus-visible=true]:ring-0",
                                                        "data-[focus-visible=true]:ring-offset-0",
                                                    ],
                                                }}
                                                className="outline-none data-[hover=true]:bg-darkGrayishBlue-100"
                                                key={key}
                                                href={getCategoryHref(categories || [], idx + 1)}
                                            >
                                                {category.name}
                                            </DropdownItem>
                                        )
                                    })}
                                </DropdownMenu>
                            </Dropdown>
                            <Separator />
                        </div>

                        {/* Desktop: all middle categories expanded */}
                        <div className="hidden lg:flex items-center gap-2">
                            {middleCategories.map((category, idx) => (
                                <span className="flex items-center gap-2 shrink-0" key={category?.slug}>
                                    <Link
                                        className="hover:text-information-500 hover:underline underline-offset-3"
                                        href={getCategoryHref(categories || [], idx + 1)}
                                    >
                                        {category.name}
                                    </Link>
                                    <Separator />
                                </span>
                            ))}
                        </div>
                    </>
                )}

                {
                    middleCategories.length <= 0 && (
                        <Separator />
                    )
                }
                <span className="truncate text-blue-500 font-semibold min-w-0">{productName}</span>
            </div>
        </div>
    );
};

export default ProductBreadcrumbs;