"use client";

import React from 'react';
import ProductsListNoResultsIcon from '@/presentation/pages/Products/components/ProductsList/ProductsListNoResultsIcon';

const ProductSearchNoResults: React.FC = () => {
    return (
        <div
            className="flex flex-col items-center justify-center gap-4 rounded-lg border border-darkGrayishBlue-500 px-6 py-12 text-center min-h-[335px] lg:min-h-[380px]"
            data-testid="product-search-no-results"
        >
            <div className="flex size-[96px] items-center justify-center rounded-full bg-darkGrayishBlue-100">
                <ProductsListNoResultsIcon />
            </div>
            <output
                className="font-sans text-[20px] font-semibold leading-6 text-blue-500"
                aria-live="polite"
            >
                Intenta con otro término de búsqueda
            </output>
        </div>
    );
};

export default ProductSearchNoResults;
