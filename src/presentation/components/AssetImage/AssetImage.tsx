import React, { FC } from 'react';
import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { Asset } from '@/domain/entity/Asset/asset';

type AssetImageProps = {
    asset: Asset
    className?: string
    alt: string
    width: number
    height: number
    sizes?: string
    breakpoint?: number
    loading?: 'lazy'
    priority?: boolean
    fetchPriority?: 'high' | 'low' | 'auto'
    skipPreload?: boolean
}

const AssetImage: FC<AssetImageProps> = ({ asset, breakpoint = 768, priority, loading, fetchPriority, sizes, width, height, alt, className, skipPreload }) => {
    // Determine strict types for loading and fetchPriority to satisfy both Sonar and Next.js ImageProps
    const resolvedLoading: 'eager' | 'lazy' | undefined = priority ? 'eager' : loading;
    const resolvedFetchPriority: 'high' | 'low' | 'auto' | undefined = priority ? 'high' : fetchPriority;

    const common = { 
        alt, 
        width, 
        height, 
        priority, 
        loading: resolvedLoading, 
        fetchPriority: resolvedFetchPriority, 
        sizes,
        className 
    };
    
    const {
        props: { srcSet: desktopSrcSet, src: desktopSrc, ...restDesktop },
    } = getImageProps({
        ...common,
        src: asset.desktopUrl,
    });

    const {
        props: { srcSet: mobileSrcSet },
    } = getImageProps({
        ...common,
        src: asset.mobileUrl || asset.desktopUrl,
    });

    if (priority && !skipPreload) {
        if (typeof mobileSrcSet === 'string') {
            preload(mobileSrcSet, { as: 'image', imageSrcSet: mobileSrcSet, media: `(max-width: ${breakpoint}px)`, fetchPriority: 'high' });
        }
        if (typeof desktopSrcSet === 'string') {
            preload(desktopSrcSet, { as: 'image', imageSrcSet: desktopSrcSet, media: `(min-width: ${breakpoint + 0.1}px)`, fetchPriority: 'high' });
        }
    }

    return (
        <picture>
            <source
                media={`(max-width: ${breakpoint}px)`}
                srcSet={mobileSrcSet}
            />
            <img
                src={desktopSrc}
                srcSet={desktopSrcSet}
                {...restDesktop}
                alt={alt}
            />
        </picture>
    );
};

export default AssetImage;