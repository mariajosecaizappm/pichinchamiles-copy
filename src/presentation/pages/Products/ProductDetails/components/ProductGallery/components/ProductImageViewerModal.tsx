"use client"

import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { ProductAsset } from "@/domain/entity/Product/product";
import Image from "next/image";
import { useCallback } from "react";
import { useImageGestures } from "../hooks/useImageGestures";

type Props = {
    asset: ProductAsset | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProductImageViewerModal = ({ asset, isOpen, onClose }: Props) => {
    const { scale, translate, handlers, reset } = useImageGestures();

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [reset, onClose]);

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={handleClose}
            placement="center"
            isDismissable={true}
            hideCloseButton={true}
            classNames={{
                wrapper: "z-[70] w-full",
                backdrop: "z-[69]",
                base: "rounded-none overflow-hidden shadow-xl mx-0 max-w-full sm:mx-0",
                body: "p-0",
            }}
        >
            <ModalContent>
                {() => (
                    <ModalBody>
                        {asset && (
                            <div
                                className="w-full overflow-hidden"
                                style={{ aspectRatio: "767/565", touchAction: "none" }}
                                {...handlers}
                            >
                                <Image
                                    src={asset.desktopUrl}
                                    alt="Vista ampliada"
                                    className="w-full h-full object-contain select-none"
                                    style={{
                                        transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                                        transformOrigin: "center center",
                                        transition: scale === 1 ? "transform 0.15s ease" : "none",
                                    }}
                                    width={767}
                                    height={565}
                                    draggable={false}
                                />
                            </div>
                        )}
                    </ModalBody>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ProductImageViewerModal;