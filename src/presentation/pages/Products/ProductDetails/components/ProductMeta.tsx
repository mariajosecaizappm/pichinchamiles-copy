"use client"

import links from "@/presentation/config/links";
import Link from "next/link";
import { useProductDetailsContext } from "../context/useProductDetailsContext";
import { Skeleton } from "@heroui/react";

type Props = {
    brand: {
        id: string
        name: string
    };
}

const ProductMeta = ({ brand }: Props) => {
    const { variation, isLoading } = useProductDetailsContext()
    return (
        <section aria-label="Información del producto" className="space-y-1 lg:space-y-2">
            <p className="font-semibold">
                Marca:{" "}
                <Link className="font-medium underline text-information-500 decoration-information-500" href={`${links.productsList}?brand=${brand.id}`}>
                    {brand.name}
                </Link>
            </p>
            {
                isLoading ? (
                    <div className="h-6 flex items-center">

                        <Skeleton className="h-4 w-full max-w-32 rounded" />
                    </div>
                ) : (
                    <p className="inline-flex items-center gap-1">
                        Stock disponible:{" "}<span>{variation?.stock ?? 0} {variation?.stock === 1 ? "unidad" : "unidades"}</span>
                    </p>
                )
            }
        </section>
    );
};

export default ProductMeta;