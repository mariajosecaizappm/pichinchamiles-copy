"use client";

import React from 'react';
import { Product, ProductSuggestion } from '@/domain/entity/Product/product';
import { MAX_SUGGESTIONS, MAX_PRODUCTS } from '../../data';
import SuggestionItem from '../SuggestionItem/SuggestionItem';
import ProductItem from '../ProductItem/ProductItem';
import ProductSearchNoResults from '../ProductSearchNoResults';

interface ProductSearchSuggestionsProps {
    suggestions: ProductSuggestion[];
    products: Product[];
    onProductClick: (product: Product) => void;
    onSuggestionClick: (suggestion: string) => void;
    showNoProducts?: boolean;
    searchQuery?: string;
}

const ProductSearchSuggestions: React.FC<ProductSearchSuggestionsProps> = ({
    suggestions,
    products,
    onProductClick,
    onSuggestionClick,
    showNoProducts = false,
    searchQuery = '',
}) => {
    const normalizedQuery = searchQuery.trim();
    const hasSuggestions = suggestions.length > 0;
    const hasProducts = products.length > 0;
    const showQueryAsDisabledSuggestion = showNoProducts && normalizedQuery.length > 0 && !hasSuggestions;
    const showSuggestionsColumn = hasSuggestions || showQueryAsDisabledSuggestion || showNoProducts;
    const useTwoColumnLayout = showNoProducts || (hasSuggestions && hasProducts);

    return (
        <div
            className="lg:shadow-lg z-50 w-full bg-white overflow-y-auto lg:rounded-b-lg lg:h-[465px]"
        >
            <div className={`grid grid-cols-1 gap-4 lg:gap-0 lg:p-6 ${useTwoColumnLayout ? 'lg:grid-cols-2' : ''}`}>
                {showSuggestionsColumn && (
                    <div className="pt-3 lg:pt-0 px-4">
                        <span className="block text-base font-semibold text-blue-500 mb-2">
                            Sugerencias
                        </span>
                        {(showQueryAsDisabledSuggestion || hasSuggestions) && (
                            <ul className="space-y-1">
                                {showQueryAsDisabledSuggestion && (
                                    <SuggestionItem
                                        key={`query-${normalizedQuery}`}
                                        suggestion={normalizedQuery}
                                        disabled
                                    />
                                )}
                                {suggestions.slice(0, MAX_SUGGESTIONS).map((suggestion) => (
                                    <SuggestionItem
                                        key={`suggestion-${suggestion.query}`}
                                        suggestion={suggestion.query}
                                        onClick={onSuggestionClick}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {hasProducts && (
                    <div className="px-4">
                        <span className="block text-base font-semibold text-blue-500 mb-2">Productos</span>
                        <ul className="space-y-2">
                            {products.slice(0, MAX_PRODUCTS).map((product) => (
                                <ProductItem
                                    key={`product-${product.id}`}
                                    product={product}
                                    onClick={onProductClick}
                                />
                            ))}
                        </ul>
                    </div>
                )}

                {showNoProducts && (
                    <div className="px-4">
                        <ProductSearchNoResults />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSearchSuggestions;
