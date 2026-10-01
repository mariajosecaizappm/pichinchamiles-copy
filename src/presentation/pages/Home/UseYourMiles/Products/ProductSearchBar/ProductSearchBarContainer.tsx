"use client";

import React, { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { autocomplete } from '@algolia/autocomplete-js';
import useProductSearch from '@/presentation/hooks/useProductSearch';
import useSession from '@/presentation/hooks/useSession';
import container from '@/presentation/config/inversify.config';
import links from '@/presentation/config/links';
import ProductsSearchUseCase from '@/domain/interactors/Products/ProductsSearchUseCase';
import UseCaseTypes from '@/domain/entity/Types/UseCaseTypes';
import type { Product, ProductSuggestion } from '@/domain/entity/Product/product';
import ProductSearchBar from './ProductSearchBar';
import ProductSearchModal from './components/ProductSearchModal/ProductSearchModal';
import {
    MAX_PRODUCTS,
    QUERY_SUGGESTIONS_SOURCE_ID,
    RECOMMENDED_PRODUCTS_SOURCE_ID,
    SEARCH_DEBOUNCE_MS,
    SEARCH_STALL_THRESHOLD_MS,
} from './data';
import {
    isProduct,
    isProductSuggestion,
    type ProductSearchBarContainerProps
} from './types';

const ProductSearchBarContainer: React.FC<ProductSearchBarContainerProps> = ({
    placeholder = "Busca tu producto",
    displaySubmitButton = false,
}) => {
    const { searchValues, submitSearch, clearSearch } = useProductSearch();
    const router = useRouter();
    const modalInputRef = useRef<HTMLInputElement | null>(null);
    const autocompleteContainerRef = useRef<HTMLDivElement | null>(null);
    const autocompleteApiRef = useRef<ReturnType<typeof autocomplete<ProductSuggestion | Product>> | null>(null);
    const searchDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { isLogged } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localSearchValue, setLocalSearchValue] = useState(searchValues.search);
    const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [hasHydrated, setHasHydrated] = useState(false);
    const [, startTransition] = useTransition();

    useEffect(() => {
        setLocalSearchValue(searchValues.search);
    }, [searchValues.search]);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    const isActiveAutocomplete = isLogged;
    const displayOnlySearchInput = hasHydrated && isActiveAutocomplete;
    const productSearchUseCase = useMemo(
        () => container.get<ProductsSearchUseCase>(UseCaseTypes.ProductsSearchUseCase),
        []
    );

    useEffect(() => {
        if (!isActiveAutocomplete || !autocompleteContainerRef.current || !isModalOpen) return;

        const autocompleteInstance = autocomplete<ProductSuggestion | Product>({
            container: autocompleteContainerRef.current,
            detachedMediaQuery: 'none',
            openOnFocus: true,
            stallThreshold: SEARCH_STALL_THRESHOLD_MS,
            placeholder,
            initialState: {
                query: searchValues.search || ''
            },
            onStateChange({ state }) {
                setIsSuggestionsLoading(state.status === 'loading' || state.status === 'stalled');

                const suggestionSource = state.collections.find(
                    (collection) => collection.source.sourceId === QUERY_SUGGESTIONS_SOURCE_ID
                );
                const productsSource = state.collections.find(
                    (collection) => collection.source.sourceId === RECOMMENDED_PRODUCTS_SOURCE_ID
                );

                const nextSuggestions = (suggestionSource?.items ?? []).filter(isProductSuggestion);
                const nextProducts = (productsSource?.items ?? []).filter(isProduct);

                setSuggestions(nextSuggestions);
                setProducts(nextProducts);
            },
            getSources({ query }) {
                return [
                    {
                        sourceId: QUERY_SUGGESTIONS_SOURCE_ID,
                        templates: {
                            item() {
                                return '';
                            }
                        },
                        async getItems() {
                            const parsedQuery = query.trim();
                            return productSearchUseCase.getAutocompleteProducts(parsedQuery);
                        }
                    },
                    {
                        sourceId: RECOMMENDED_PRODUCTS_SOURCE_ID,
                        templates: {
                            item() {
                                return '';
                            }
                        },
                        async getItems() {
                            const parsedQuery = query.trim();
                            const result = await productSearchUseCase.searchProducts({
                                perPage: MAX_PRODUCTS,
                                page: 1,
                                search: parsedQuery,
                                category: [],
                                sort: '',
                                brand: '',
                            });

                            return result.list.data;
                        }
                    }
                ];
            }
        });

        autocompleteApiRef.current = autocompleteInstance;
        autocompleteInstance.refresh();

        return () => {
            if (searchDebounceTimerRef.current) {
                clearTimeout(searchDebounceTimerRef.current);
            }
            autocompleteInstance.destroy();
            autocompleteApiRef.current = null;
        };
    }, [isActiveAutocomplete, placeholder, productSearchUseCase, searchValues.search, isModalOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedSearchValue = localSearchValue?.trim();

        if (parsedSearchValue) {
            startTransition(() => {
                submitSearch(parsedSearchValue);
            });
            setIsModalOpen(false);
            return;
        }

        if (searchValues.search) {
            clearSearch();
        }
    };


    const handleClick = () => {
        if(isActiveAutocomplete && !isModalOpen) {
            setIsModalOpen(true);
            requestAnimationFrame(() => {
                if (modalInputRef.current) {
                    modalInputRef.current?.focus();
                }
            });
        }
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSelectProduct = (product: Product) => {
        setIsModalOpen(false);
        router.push(`${links.productsList}/${product.slug}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape' && isModalOpen) {
            e.preventDefault();
            handleCloseModal();
        }
    };

    const syncAutocompleteSearch = (query: string, immediate = false) => {
        if (!autocompleteApiRef.current) return;

        if (searchDebounceTimerRef.current) {
            clearTimeout(searchDebounceTimerRef.current);
        }

        const runSearch = () => {
            autocompleteApiRef.current?.setQuery(query);
            autocompleteApiRef.current?.refresh();
        };

        if (immediate || !query.trim()) {
            runSearch();
            return;
        }

        searchDebounceTimerRef.current = setTimeout(runSearch, SEARCH_DEBOUNCE_MS);
    };

    const handleChange = (value: string) => {
        setLocalSearchValue(value);

        if (!isActiveAutocomplete || !autocompleteApiRef.current) {
            if (!value.trim() && searchValues.search) {
                clearSearch();
            }
            return;
        }

        syncAutocompleteSearch(value, !value.trim());

        if (!value.trim() && searchValues.search) {
            clearSearch();
        }
    };

    return (
        <div className="relative">
            <div ref={autocompleteContainerRef} className="hidden" />
            <ProductSearchModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                searchValue={localSearchValue}
                onSearchChange={handleChange}
                onSearchSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                inputRef={modalInputRef}
                suggestions={suggestions}
                products={products}
                isLoading={isSuggestionsLoading}
                searchQuery={localSearchValue}
                onClearSuggestions={() => {
                    if (!isActiveAutocomplete || !autocompleteApiRef.current) {
                        setLocalSearchValue('');
                        if (searchValues.search) {
                            clearSearch();
                        }
                        return;
                    }

                    if (searchDebounceTimerRef.current) {
                        clearTimeout(searchDebounceTimerRef.current);
                    }

                    autocompleteApiRef.current.setQuery('');
                    autocompleteApiRef.current.refresh();
                    if (searchValues.search) {
                        clearSearch();
                    }
                }}
                onSelectProduct={handleSelectProduct}
                onSubmit={(values) => {
                    const parsedSearch = values.search.trim();
                    setLocalSearchValue(values.search);
                    if (isActiveAutocomplete && autocompleteApiRef.current) {
                        autocompleteApiRef.current.setQuery(values.search);
                    }
                    if (parsedSearch) {
                        startTransition(() => {
                            submitSearch(parsedSearch);
                        });
                    } else if (searchValues.search) {
                        clearSearch();
                    }
                }}
            />
            <ProductSearchBar
                value={localSearchValue}
                onChange={handleChange}
                onClick={handleClick}
                onSubmit={handleSubmit}
                placeholder={placeholder}
                displayOnly={displayOnlySearchInput}
                displaySubmitButton={displaySubmitButton}
            />
        </div>
    );
};

export default ProductSearchBarContainer;
