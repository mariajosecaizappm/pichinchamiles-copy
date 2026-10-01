import { ProductAsset } from "@/domain/entity/Product/product";
import AssetImage from "@/presentation/components/AssetImage";
import { getPlatformAsset } from "@/presentation/helpers/asset";
import { getVideoThumbnail } from "@/presentation/helpers/video";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface Props {
  asset: ProductAsset;
  zoomSrc?: string;
  alt?: string;
  zoom?: number;
  containerRef: React.RefObject<HTMLElement | null>;
  size: { w: number; h: number };
  active: boolean;
  lensLeft: number;
  lensTop: number;
  lensW: number;
  lensH: number;
  bgX: number;
  bgY: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  productName: string;
}

const SideBySideMagnifier =({
    asset,
    zoomSrc,
    alt = "",
    zoom = 2.5,
    containerRef,
    size,
    active,
    lensLeft,
    lensTop,
    lensW,
    lensH,
    bgX,
    bgY,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    productName,
}: Props) => {

    return (
        <div className="relative w-full h-full">
            {/* Main image */}
            <figure
                ref={containerRef as React.RefObject<HTMLElement>}
                aria-label="Imagen del producto. Mueve el cursor para activar el zoom."
                className="relative w-full h-full cursor-crosshair overflow-hidden m-0"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
            >
                {
                    asset.type === 'image' ? (
                        <AssetImage
                            asset={asset}
                            alt={alt}
                            width={size.w}
                            height={size.h}
                            className="w-full h-full object-cover block"
                        />
                    ) : (
                        <iframe
                            src={getVideoThumbnail(getPlatformAsset(asset) ?? asset.desktopUrl) as string}
                            title={`${productName} video`}
                            width="100%"
                            height="100%"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                        />
                    )
                }
                <AnimatePresence>
                    {active && size.w > 0 && (
                        <motion.div
                            className="absolute pointer-events-none z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                left: lensLeft,
                                top: lensTop,
                                width: lensW,
                                height: lensH,
                                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.35)",
                            }}
                            aria-hidden
                        />
                    )}
                </AnimatePresence>
            </figure>

            {/* Zoomed panel — floats to the right, no layout impact */}
            <AnimatePresence>
                {active && size.w > 0 && (
                    <motion.div
                        className="absolute top-0 bg-white border border-grayscale-200 z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{
                            left: "100%",
                            width: size.w,
                            height: size.h,
                            backgroundImage: `url(${zoomSrc ?? asset?.desktopUrl})`,
                            backgroundSize: `${size.w * zoom}px ${size.h * zoom}px`,
                            backgroundPosition: `${bgX}px ${bgY}px`,
                            backgroundRepeat: "no-repeat",
                        }}
                        aria-hidden
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default SideBySideMagnifier;