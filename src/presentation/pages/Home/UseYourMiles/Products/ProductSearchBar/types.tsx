import type React from 'react';
import type { Product, ProductSuggestion } from '@/domain/entity/Product/product';
import { Input } from '@heroui/react';

export interface ProductSearchBarProps extends Omit<
    React.ComponentProps<typeof Input>,
    'onChange' | 'onFocus' | 'onBlur' | 'onKeyDown' | 'onClick' | 'value'
> {
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    placeholder?: string;
    children?: React.ReactNode;
    displayOnly?: boolean;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    displaySubmitButton?: boolean;
    isLoading?: boolean;
    hideFocusRing?: boolean;
}

export interface ProductSearchBarContainerProps {
    placeholder?: string;
    displaySubmitButton?: boolean;
}

export const isProductSuggestion = (item: ProductSuggestion | Product): item is ProductSuggestion => {
    return 'query' in item;
};

export const isProduct = (item: ProductSuggestion | Product): item is Product => {
    return 'slug' in item && 'name' in item;
};
