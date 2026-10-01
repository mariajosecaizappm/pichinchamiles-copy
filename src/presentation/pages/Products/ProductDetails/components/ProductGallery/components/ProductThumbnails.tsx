"use client"

import { ProductAsset } from "@/domain/entity/Product/product";
import { getPlatformAsset } from "@/presentation/helpers/asset";
import { getVideoThumbnail } from "@/presentation/helpers/video";
import ArrowIcon from "@/presentation/pages/Home/components/Header/components/Menu/components/Icons/ArrowIcon";
import { cn } from "@heroui/react";
import Image from "next/image";
import { useState } from "react";

const VISIBLE_COUNT = 4;

type Props = {
    assets: ProductAsset[];
    selectedImage: number;
    setSelectedImage: (index: number) => void;
}

const ProductThumbnails = ({ assets, selectedImage, setSelectedImage }: Props) => {
    const [startIndex, setStartIndex] = useState(0);
    const canScrollUp = startIndex > 0;
    const canScrollDown = startIndex + VISIBLE_COUNT < assets.length;
    const visibleAssets = assets.slice(startIndex, startIndex + VISIBLE_COUNT);

    return (
        <div className="flex flex-col items-center gap-2 shrink-0">
            <button
                onClick={() => setStartIndex(i => i - 1)}
                disabled={!canScrollUp}
                aria-label="Ver imágenes anteriores"
                className={cn(
                    "-rotate-90 transition-opacity text-grayscale-400",
                    canScrollUp ? "hover:text-blue-500 cursor-pointer" : "opacity-30 cursor-not-allowed"
                )}
            >
                <ArrowIcon />
            </button>
            <ol aria-label="imágenes del producto" className="flex flex-col gap-3">
                {visibleAssets.map((asset, idx) => {
                    const index = startIndex + idx;
                    return (
                        <li key={asset.id}>
                            <button
                                onClick={() => setSelectedImage(index)}
                                aria-selected={selectedImage === index}
                                role="tab"
                                aria-label={`Seleccionar imagen ${index + 1}`}
                                className={cn(
                                    "cursor-pointer rounded-2xl border-[2.6px] overflow-hidden transition-colors w-17.5 h-17.5 flex items-center justify-center",
                                    selectedImage === index
                                        ? "border-information-500"
                                        : "border-neutral-300 hover:border-neutral-200"
                                )}
                            >
                                <Image
                                    src={asset.type === 'image' ? getPlatformAsset(asset) : (getVideoThumbnail(asset.desktopUrl) ?? asset.desktopUrl)}
                                    alt={`Vista ${index + 1}`}
                                    className="w-15 h-15 object-contain rounded-xl"
                                    width={60}
                                    height={60}
                                />
                            </button>
                        </li>
                    );
                })}
            </ol>
            <button
                onClick={() => setStartIndex(i => i + 1)}
                disabled={!canScrollDown}
                aria-label="Ver imágenes siguientes"
                className={cn(
                    "rotate-90 transition-opacity text-grayscale-400",
                    canScrollDown ? "hover:text-blue-500 cursor-pointer" : "opacity-30 cursor-not-allowed"
                )}
            >
                <ArrowIcon />
            </button>
        </div>
    );
};

export default ProductThumbnails;


