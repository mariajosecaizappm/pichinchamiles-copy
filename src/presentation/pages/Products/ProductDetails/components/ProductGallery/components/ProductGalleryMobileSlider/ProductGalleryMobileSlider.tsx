"use client"

import { ProductAsset } from "@/domain/entity/Product/product";
import { getPlatformAsset } from "@/presentation/helpers/asset";
import { getVideoIframeUrl } from "@/presentation/helpers/video";
import Image from "next/image";
import { publicApiType, ScrollMenu } from "react-horizontal-scrolling-menu";
import CarouselDots from "../CarouselDots";

type Props = {
    productName: string;
    assets: ProductAsset[];
    selectedImage: number;
    setModalOpen: (open: boolean) => void;
    apiRef: React.RefObject<publicApiType>;
    handleUpdate: (api: publicApiType) => void;
    handleDotClick: (index: number) => void;
}

const ITEM_ID_PREFIX = "gallery-slide";

const ProductGalleryMobileSlider = ({
    productName,
    assets,
    selectedImage,
    setModalOpen,
    apiRef,
    handleUpdate,
    handleDotClick,
}: Props) => {
 

    return (
        <div className="space-y-4">
            <ScrollMenu
                apiRef={apiRef}
                onUpdate={handleUpdate}
                wrapperClassName="overflow-hidden"
                scrollContainerClassName="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
                itemClassName="shrink-0 w-full snap-start px-6"
            >
                {assets.map((asset, index) => {
                    const itemId = `${ITEM_ID_PREFIX}-${index}`;
                    return (
                        <div key={itemId} data-item-id={itemId} className="w-full">
                            <figure className="aspect-243/179 relative">
                                {asset.type === "video" ? (
                                    <iframe
                                        src={getVideoIframeUrl(getPlatformAsset(asset)) ?? undefined}
                                        title={`${productName} video`}
                                        className="absolute inset-0 w-full h-full"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        className="w-full h-full block"
                                        onClick={() => setModalOpen(true)}
                                        aria-label="Ver galería de imágenes"
                                    >
                                        <Image
                                            src={getPlatformAsset(asset)}
                                            alt={`Imagen de ${productName} ${index + 1}`}
                                            className="w-full h-full object-contain"
                                            width={767}
                                            height={565}
                                            priority={index === 0}
                                        />
                                    </button>
                                )}
                            </figure>
                        </div>
                    );
                })}
            </ScrollMenu>

            <CarouselDots
                assets={assets}
                selectedImage={selectedImage}
                setSelectedImage={handleDotClick}
            />
        </div>
    );
};

export default ProductGalleryMobileSlider;
