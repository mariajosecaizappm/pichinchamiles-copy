"use client";

import React from 'react';
import Form, { FormRef } from '@/presentation/components/Form/context/Form';
import FormInput from '@/presentation/components/Form/controls/FormInput';
import IconSearch from '@/presentation/components/icons/IconSearch';

interface ProductSearchBarProps {
  onSearch?: (searchTerm: string) => void;
  placeholder?: string;
}

interface SearchFormValues extends Record<string, unknown> {
  search: string;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ 
    onSearch,
    placeholder = "Busca tu producto"
}) => {
    const formRef = React.useRef<FormRef>(null);

    const handleSubmit = async (values: SearchFormValues) => {
        if (onSearch && values.search.trim()) {
            onSearch(values.search.trim());
        }
    };

    return (
        <Form<SearchFormValues>
            ref={formRef}
            initialValues={{ search: '' }}
            onSubmit={handleSubmit}
            className="flex-1"
            role="search"
            aria-label="Buscador de productos"
        >
            <FormInput
                name="search"
                aria-label="Buscar productos"
                placeholder={placeholder}
                startContent={
                    <span aria-hidden="true"><IconSearch /></span>
                }
                classNames={{
                    inputWrapper: "bg-white border border-gray-300 rounded-lg shadow-none",
                    input: "text-gray-700 placeholder-gray-400",
                }}
            />
        </Form>
    );
};

export default ProductSearchBar;
