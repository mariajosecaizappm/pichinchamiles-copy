"use client";

import React from 'react';
import { Product, ProductSuggestion } from '@/domain/entity/Product/product';
import ProductSearchSuggestions from './ProductSearchSuggestions';
import ProductSearchBarLoader from '../ProductSearchBarLoader/ProductSearchBarLoader';

interface ProductSearchSuggestionsContainerProps {
    onSelectProduct?: (product: Product) => void;
    onSelectSuggestion?: (suggestion: string) => void;
    onCloseModal?: () => void;
    suggestions: ProductSuggestion[];
    products: Product[];
    isLoading?: boolean;
    searchQuery?: string;
    isOpen?: boolean;
    onClearSuggestions?: () => void;
    onSubmit?: (values: { search: string; page: number }) => void;
}

const ProductSearchSuggestionsContainer: React.FC<ProductSearchSuggestionsContainerProps> = ({
    onSelectProduct,
    onSelectSuggestion,
    onCloseModal,
    suggestions = [],
    products = [],
    isLoading = false,
    searchQuery = '',
    isOpen = false,
    onClearSuggestions = () => {},
    onSubmit = () => {}
}) => {
    const normalizedQuery = searchQuery.trim();

    const handleProductClick = (product: Product) => {
        if (onSelectProduct) {
            onSelectProduct(product);
            return;
        }

        onClearSuggestions();
        onCloseModal?.();
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (onSelectSuggestion) {
            onSelectSuggestion(suggestion);
        }

        onSubmit({ search: suggestion, page: 1 });

        if (onCloseModal) {
            onCloseModal();
        }
    };

    if (isLoading && isOpen) {
        return <ProductSearchBarLoader searchQuery={searchQuery} />;
    }

    if (!isOpen) {
        return null;
    }

    if (normalizedQuery.length > 0 && products.length === 0) {
        return (
            <ProductSearchSuggestions
                suggestions={suggestions}
                products={products}
                showNoProducts
                searchQuery={normalizedQuery}
                onProductClick={handleProductClick}
                onSuggestionClick={handleSuggestionClick}
            />
        );
    }

    if (suggestions.length > 0 || products.length > 0) {
        return (
            <ProductSearchSuggestions
                suggestions={suggestions}
                products={products}
                onProductClick={handleProductClick}
                onSuggestionClick={handleSuggestionClick}
            />
        );
    }

    return null;
};

export default ProductSearchSuggestionsContainer;
