"use client";

import React, { useEffect } from 'react';
import ProductSearchBar from '../../ProductSearchBar';
import ProductSearchSuggestionsContainer from '../ProductSearchSuggestions/ProductSearchSuggestionsContainer';
import Modal from '@/presentation/components/Modal/Modal';
import useIsDesktop from '@/presentation/hooks/useIsDesktop';
import IconLargeArrow from '@/presentation/components/icons/IconLargeArrow';
import { ProductSuggestion } from '@/domain/entity/Product/product';
import type { Product } from '@/domain/entity/Product/product';
import { MOBILE_BREAKPOINT } from '@/presentation/config/breakpoint';

interface ProductSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
    suggestions: ProductSuggestion[];
    products: Product[];
    isLoading: boolean;
    searchQuery: string;
    onClearSuggestions: () => void;
    onSubmit: (values: { search: string }) => void;
    onSelectProduct?: (product: Product) => void;
}


const shouldShowSuggestionsPanel = (
    searchQuery: string,
    products: Product[],
    isLoading: boolean,
) => searchQuery.trim().length > 0 || products.length > 0 || isLoading;

const ProductSearchModal: React.FC<ProductSearchModalProps> = ({
    isOpen,
    onClose,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    onKeyDown,
    placeholder = "Busca tu producto",
    inputRef,
    suggestions,
    products,
    isLoading,
    searchQuery,
    onClearSuggestions,
    onSubmit,
    onSelectProduct,
}) => {
    const { isDesktop } = useIsDesktop(MOBILE_BREAKPOINT);

    const showSuggestionsPanel = shouldShowSuggestionsPanel(searchQuery, products, isLoading);

    useEffect(() => {
        if (isOpen && isDesktop) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
        }
    }, [isOpen, isDesktop]);

    if (!isOpen) return null;

    if (isDesktop) {
        return (
            <Modal
                closeButtonAriaLabel="Cerrar búsqueda"
                classNames={{
                    body: 'p-0',
                }}
                isOpen={isOpen} onClose={onClose}>
                <div
                    className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-121"
                >
                    <div className="max-w-[748px] w-full max-h-[80vh] overflow-hidden pointer-events-auto rounded-lg border border-darkGrayishBlue-300 bg-white shadow-lg">
                        <ProductSearchBar
                            value={searchValue}
                            onChange={onSearchChange}
                            onKeyDown={onKeyDown}
                            onSubmit={onSearchSubmit}
                            placeholder={placeholder}
                            inputRef={inputRef}
                            hideFocusRing
                        >
                            <ProductSearchSuggestionsContainer 
                                onCloseModal={onClose}
                                onSelectProduct={onSelectProduct}
                                suggestions={suggestions}
                                products={products}
                                isLoading={isLoading}
                                searchQuery={searchQuery}
                                isOpen={showSuggestionsPanel}
                                onClearSuggestions={onClearSuggestions}
                                onSubmit={onSubmit}
                            />
                        </ProductSearchBar>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="bottom"
            closeButtonAriaLabel="Cerrar búsqueda"
            headerButton={
                <div className='flex items-center relative justify-center'>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-blue-500 absolute left-0 top-1/2 -translate-y-1/2"
                    >
                        <IconLargeArrow className='fill-blue-500'/>
                    </button>
                    <span className="text-base font-semibold text-center text-blue-500">¿Qué quieres canjear?</span>
                </div>
            }
            classNames={{
                wrapper: "z-121",
                base: "!m-0 w-full h-full max-h-full !rounded-none overflow-hidden font-sans",
                backdrop: "bg-white z-120",
                header: 'border-none',
                body: "p-0 overflow-y-auto gap-0",
                closeButton: "hidden"
            }}
        >
            <div className="px-6 pt-2 pb-3.75 border-b border-darkGrayishBlue-300">
                <ProductSearchBar
                    value={searchValue}
                    onChange={onSearchChange}
                    onSubmit={onSearchSubmit}
                    placeholder={placeholder}
                    inputRef={inputRef}
                    hideFocusRing
                />
            </div>
            <ProductSearchSuggestionsContainer 
                onCloseModal={onClose}
                onSelectProduct={onSelectProduct}
                suggestions={suggestions}
                products={products}
                isLoading={isLoading}
                searchQuery={searchQuery}
                isOpen={showSuggestionsPanel}
                onClearSuggestions={onClearSuggestions}
                onSubmit={onSubmit}
            />
        </Modal>
    );
};

export default ProductSearchModal;
