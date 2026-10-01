"use client";

import React from 'react';
import { Product } from '@/domain/entity/Product/product';
import { formatMiles } from '@/presentation/helpers/quantities';
import Image from 'next/image';
import { getPrimaryAsset } from '@/presentation/helpers/asset';

interface ProductItemProps {
    product: Product;
    onClick: (product: Product) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
    product,
    onClick
}) => {
    const handleClick = () => {
        onClick(product);
    };


    const productImage = getPrimaryAsset(product.assets);

    return (
        <li>
            <button
                type="button"
                onClick={handleClick}
                className="lg:max-w-[318px] w-full flex flex-row border border-gray-100 rounded-lg text-left cursor-pointer"
            >
                <div className="flex items-center w-full">
                    {productImage && (
                        <Image
                            src={productImage.desktopUrl}
                            alt={product.name}
                            width={140}
                            height={115}
                            className="w-35 h-28.75 object-cover rounded"
                        />
                    )}
                    <div className="flex flex-col py-2 px-1">
                        <span className="text-xs font-medium text-blue-500 leading-4 text-wrap">
                            {product.name}
                        </span>
                        <div>
                            {!!product.minPointsPrice && (() => {
                                const formatted = formatMiles(product.minPointsPrice);
                                return (
                                    <p className="text-blue-500 text-lg font-semibold leading-5">
                                        <span className="font-medium text-xs text-grayscale-500">Desde: </span>
                                        {formatted} millas
                                    </p>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </button>
        </li>
    );
};

export default ProductItem;
