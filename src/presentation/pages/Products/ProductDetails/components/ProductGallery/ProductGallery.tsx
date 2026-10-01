"use client"

import { ProductAsset } from "@/domain/entity/Product/product";
import { getPlatformAsset } from "@/presentation/helpers/asset";
import { getVideoIframeUrl, getVideoThumbnail } from "@/presentation/helpers/video";
import useIsDesktop from "@/presentation/hooks/useIsDesktop";
import Image from "next/image";
import ProductGalleryMobileSlider from "./components/ProductGalleryMobileSlider";
import ProductGalleryModal from "./components/ProductGalleryModal";
import ProductImageViewerModal from "./components/ProductImageViewerModal";
import ProductThumbnails from "./components/ProductThumbnails";
import SideBySideMagnifier from "./components/SideBySideMagnifier";


type Props = {
    productName: string;
    assets: ProductAsset[];
    selectedImage: number;
    setSelectedImage: (index: number) => void;
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    viewerAsset: ProductAsset | null;
    setViewerAsset: (asset: ProductAsset | null) => void;
}

const ProductGallery = ({
    productName,
    assets,
    selectedImage,
    setSelectedImage,
    modalOpen,
    setModalOpen,
    viewerAsset,
    setViewerAsset,
}: Props) => {
    const asset = assets[selectedImage];
    const { isDesktop } = useIsDesktop(998);
    return (
        <>
            <div className="space-y-4 lg:space-y-0 lg:flex lg:flex-row-reverse lg:gap-4 lg:items-start">
                <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:gap-3">
                    <figure className="aspect-243/179 lg:max-w-[536.9px] lg:max-h-[395.5px] lg:relative lg:rounded-lg h-full relative">
                        {isDesktop ? (
                            <>
                                {
                                    asset.type === "video" ? (
                                        <iframe
                                            src={getVideoIframeUrl(getPlatformAsset(asset)) ?? undefined}
                                            title={`${productName} video`}
                                            className="w-full h-full"
                                            allow="autoplay; fullscreen"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <SideBySideMagnifier
                                            asset={asset}
                                            alt={`Imagen de ${productName} ${selectedImage + 1}`}
                                            zoom={2.5}
                                            productName={productName}
                                        />
                                    )
                                }
                            </>
                        ) : (
                            <>
                                {
                                    asset?.type === "video" ? (
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
                                                src={asset.type === 'image' ? getPlatformAsset(asset) : (getVideoThumbnail(asset.desktopUrl) ?? asset.desktopUrl)}
                                                alt={`Imagen de ${productName} ${selectedImage + 1}`}
                                                className="w-full h-full object-contain"
                                                width={767}
                                                height={565}
                                            />
                                        </button>
                                    )

                                }
                            </>

                        )}
                    </figure>

                    <p className="hidden lg:flex items-center gap-2 font-medium justify-center">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" fill="#0F265C" />
                        </svg>
                        Pasa el cursor para ampliar la imagen
                    </p>
                </div>
                <div className="hidden lg:block">
                    <ProductThumbnails
                        assets={assets}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                    />
                </div>
                <div className="lg:hidden">
                    <ProductGalleryMobileSlider
                        assets={assets}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        setModalOpen={setModalOpen}
                        productName={productName}
                    />
                </div>
            </div>

            <ProductGalleryModal
                productName={productName}
                assets={assets}
                isOpen={modalOpen && !isDesktop}
                onClose={() => setModalOpen(false)}
                initialIndex={selectedImage}
                onImageSelect={setViewerAsset}
            />

            <ProductImageViewerModal
                asset={viewerAsset}
                isOpen={viewerAsset !== null && !isDesktop}
                onClose={() => setViewerAsset(null)}
            />
        </>
    );
};

export default ProductGallery;