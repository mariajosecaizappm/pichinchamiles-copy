import { ProductAsset } from "@/domain/entity/Product/product";
import React, { useCallback, useEffect, useRef, useState } from "react";
import SideBySideMagnifier from "./SideBySideMagnifier";

interface Props {
    productName: string;
    asset: ProductAsset;
    zoomSrc?: string;
    alt?: string;
    zoom?: number;
}

const SideBySideMagnifierContainer = ({
    productName,
    asset,
    zoomSrc,
    alt = "",
    zoom = 2.5,
}: Props) => {
    const containerRef = useRef<HTMLElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [active, setActive] = useState(false);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ w: width, h: height });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const lensW = Math.round(size.w / zoom);
    const lensH = Math.round(size.h / zoom);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const rect = containerRef.current!.getBoundingClientRect();
        setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }, []);

    const lensLeft = Math.min(Math.max(cursor.x - lensW / 2, 0), size.w - lensW);
    const lensTop = Math.min(Math.max(cursor.y - lensH / 2, 0), size.h - lensH);

    const bgX = -(lensLeft * zoom);
    const bgY = -(lensTop * zoom);

    return (
        <SideBySideMagnifier
            productName={productName}
            asset={asset}
            zoomSrc={zoomSrc}
            alt={alt}
            zoom={zoom}
            containerRef={containerRef}
            size={size}
            active={active}
            lensLeft={lensLeft}
            lensTop={lensTop}
            lensW={lensW}
            lensH={lensH}
            bgX={bgX}
            bgY={bgY}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            onMouseMove={handleMouseMove}
        />
    );
}

export default SideBySideMagnifierContainer;