"use client";

import React from 'react';
import IconSearchLoader from '@/presentation/components/icons/IconSearchLoader';

interface ProductSearchBarLoaderProps {
    searchQuery: string;
}

const ProductSearchBarLoader: React.FC<ProductSearchBarLoaderProps> = ({
    searchQuery,
}) => {
    const normalizedQuery = searchQuery.trim();

    return (
        <div className="flex flex-col items-center justify-center p-4 lg:p-10 bg-white lg:h-[465px]">
            <div className="mb-2.5">
                <IconSearchLoader className="w-16 h-16 animate-spin" />
            </div>
            <p className="text-[22px] font-normal text-blue-500 text-center max-w[288px]">
                {normalizedQuery ? `Productos para ${normalizedQuery}` : 'Buscando productos...'}
            </p>
        </div>
    );
};

export default ProductSearchBarLoader;
