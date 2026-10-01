"use client"

import { ProductAsset } from "@/domain/entity/Product/product";
import { useCallback, useEffect, useRef } from "react";
import { publicApiType } from "react-horizontal-scrolling-menu";
import ProductGalleryMobileSlider from "./ProductGalleryMobileSlider";

type Props = {
    productName: string;
    assets: ProductAsset[];
    selectedImage: number;
    setSelectedImage: (index: number) => void;
    setModalOpen: (open: boolean) => void;
}
const ITEM_ID_PREFIX = "gallery-slide";
const ProductGalleryMobileSliderContainer = ({
    productName,
    assets,
    selectedImage,
    setSelectedImage,
    setModalOpen,
}: Props) => {
    const apiRef = useRef({} as publicApiType);
    const prevSelectedImage = useRef(selectedImage);
    const updateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (prevSelectedImage.current === selectedImage) return;
        prevSelectedImage.current = selectedImage;

        if (!apiRef.current.scrollToItem) return;
        if (apiRef.current.isItemVisible(`${ITEM_ID_PREFIX}-${selectedImage}`)) return;

        const item = apiRef.current.getItemById(`${ITEM_ID_PREFIX}-${selectedImage}`);
        if (item) {
            apiRef.current.scrollToItem(item, "smooth", "start");
        }
    }, [selectedImage]);

    const handleUpdate = useCallback(
        (api: publicApiType) => {
            if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
            updateTimerRef.current = setTimeout(() => {
                for (let i = 0; i < assets.length; i++) {
                    if (api.isItemVisible(`${ITEM_ID_PREFIX}-${i}`)) {
                        setSelectedImage(i);
                        break;
                    }
                }
            }, 120);
        },
        [assets.length, setSelectedImage]
    );

    const handleDotClick = useCallback(
        (index: number) => {
            setSelectedImage(index);
            if (apiRef.current.scrollToItem) {
                const item = apiRef.current.getItemById(`${ITEM_ID_PREFIX}-${index}`);
                if (item) {
                    apiRef.current.scrollToItem(item, "smooth", "start");
                }
            }
        },
        [setSelectedImage]
    );

    return (
        <ProductGalleryMobileSlider
            productName={productName}
            assets={assets}
            selectedImage={selectedImage}
            setModalOpen={setModalOpen}
            apiRef={apiRef}
            handleUpdate={handleUpdate}
            handleDotClick={handleDotClick}
        />
    );
};

export default ProductGalleryMobileSliderContainer;
