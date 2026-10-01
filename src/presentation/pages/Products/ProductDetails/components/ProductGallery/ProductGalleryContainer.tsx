"use client"

import { ProductAsset } from "@/domain/entity/Product/product";
import { useEffect, useState } from "react";
import { useProductDetailsContext } from "../../context/useProductDetailsContext";
import ProductGallery from "./ProductGallery";
import ProductGallerySkeleton from "./ProductGallerySkeleton";

type Props = {
    productName: string;
}

const ProductGalleryContainer = ({ productName }: Props) => {
    const {assets, variation, isLoading, selectedFeatures } = useProductDetailsContext()
    const [selectedImage, setSelectedImage] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewerAsset, setViewerAsset] = useState<ProductAsset | null>(null);

    useEffect(() => {
        setSelectedImage(0);
    }, [variation, selectedFeatures]);

    if (isLoading || !assets || assets.length === 0 || !assets[selectedImage]) {
        return (
            <ProductGallerySkeleton />
        );
    }

    return (
        <ProductGallery
            assets={assets}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            viewerAsset={viewerAsset}
            setViewerAsset={setViewerAsset}
            productName={productName}
        />
    );
};

export default ProductGalleryContainer;