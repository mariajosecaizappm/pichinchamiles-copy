"use client";

import SearchInput from '@/presentation/components/Form/components/SearchInput';
import IconSearch from '@/presentation/components/icons/IconSearch';
import { Button } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import type { ProductSearchBarProps } from './types';

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
    value,
    onChange,
    onFocus,
    onBlur,
    onSubmit,
    onKeyDown,
    onClick,
    placeholder = "Busca tu producto",
    children,
    displayOnly = false,
    inputRef,
    displaySubmitButton,
    isLoading,
    hideFocusRing = false,
    ...props
}) => {
    const handleDisplayOnlyClick = () => {
        if (displayOnly) {
            onClick?.();
        }
    };

    const inputElement = (
        <SearchInput
            name="search"
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            displayOnly={displayOnly}
            placeholder={placeholder}
            hideFocusRing={hideFocusRing}
            inputRef={inputRef}
            {...props}
        />
    );

    const submitButton = (
        <Button
            className='bg-darkGrayishBlue-100 w-10 h-12 p-0 min-w-10 max-w-10 text-blue-500 rounded-sm border border-darkGrayishBlue-300'
            color='secondary'
            type='submit'
            isLoading={isLoading}
        >
            {
                !isLoading && <IconSearch />
            }
        </Button>
    );

    if (displayOnly) {
        return (
            <div className={clsx("relative", "cursor-pointer")}>
                <form
                    onSubmit={onSubmit}
                    className="flex-1"
                    role="search"
                    aria-label="Buscador de productos"
                >
                    {
                        displaySubmitButton ? (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="w-full cursor-pointer text-left"
                                    onClick={handleDisplayOnlyClick}
                                    aria-label={placeholder}
                                >
                                    <span className="pointer-events-none block">{inputElement}</span>
                                </button>
                                {submitButton}
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="w-full cursor-pointer text-left"
                                onClick={handleDisplayOnlyClick}
                                aria-label={placeholder}
                            >
                                <span className="pointer-events-none block">{inputElement}</span>
                            </button>
                        )
                    }
                </form>
                {children}
            </div>
        );
    }

    return (
        <div className={clsx("relative")}>
            <form
                onSubmit={onSubmit}
                className="flex-1"
                role="search"
                aria-label="Buscador de productos"
            >
                {
                    displaySubmitButton ? (
                        <div className="flex items-center gap-2">
                            {inputElement}
                            {submitButton}
                        </div>
                    ) : (
                        inputElement
                    )
                }
            </form>
            {children}
        </div>
    );
};

export default ProductSearchBar;
