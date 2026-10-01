"use client"

import { ProductAsset } from "@/domain/entity/Product/product";
import Modal from "@/presentation/components/Modal";
import { getPlatformAsset } from "@/presentation/helpers/asset";
import { getVideoIframeUrl } from "@/presentation/helpers/video";
import Image from "next/image";

type Props = {
    productName: string;
    assets: ProductAsset[];
    isOpen: boolean;
    onClose: () => void;
    initialIndex?: number;
    onImageSelect: (asset: ProductAsset) => void;
}

const ProductGalleryModal = ({ productName, assets, isOpen, onClose, initialIndex = 0, onImageSelect }: Props) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            closeButtonAriaLabel="Cerrar galería"
            scrollBehavior="inside"
            classNames={{
                wrapper: "!p-0 sm:!p-0",
                base: "!m-0 w-full max-w-full h-full max-h-full !rounded-none md:!m-0 md:!max-w-full md:!h-full md:!max-h-full md:!rounded-none",
                header: "py-4 px-6 border-b border-darkGrayishBlue-300 h-14 min-h-14",
                closeButton: "top-4 right-4",
                body: "p-0 overflow-y-auto overscroll-contain",
            }}
            headerButton={
                <p className="font-sans font-semibold text-base leading-6">Galería de producto</p>
            }
        >
            <div className="px-6">
                {assets.map((asset, idx) => (
                    <button
                        key={asset.id || idx}
                        type="button"
                        className="w-full flex items-center justify-center p-6 border-b-8 border-darkGrayishBlue-100 last:border-b-0 relative aspect-243/179"
                        onClick={() => onImageSelect(asset)}
                        aria-label={`Ver imagen ${idx + 1} en detalle`}
                    >
                        {
                            asset.type === 'image' ? (
                                <Image
                                    src={asset.desktopUrl}
                                    alt={`Imagen de ${productName} ${idx + 1}`}
                                    className="w-full h-auto object-contain"
                                    width={767}
                                    height={565}
                                    priority={idx === initialIndex}
                                />
                            ) : (
                                <iframe
                                    src={getVideoIframeUrl((getPlatformAsset(asset) ?? asset.desktopUrl)) as string}
                                    className="absolute inset-0 w-full h-full"
                                    title={`${productName} video`}
                                    allow="autoplay; fullscreen"
                                    allowFullScreen
                                />
                            )
                        }
                    </button>
                ))}
            </div>
        </Modal>
    );
};

export default ProductGalleryModal;