"use client";

import React from 'react';

interface SuggestionItemProps {
    suggestion: string;
    onClick?: (suggestion: string) => void;
    disabled?: boolean;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
    suggestion,
    onClick,
    disabled = false,
}) => {
    const handleClick = () => {
        onClick?.(suggestion);
    };

    if (disabled) {
        return (
            <li>
                <span className="block w-full text-left text-wrap py-2.5 text-sm text-gray-800">
                    {suggestion}
                </span>
            </li>
        );
    }

    return (
        <li>
            <button
                type="button"
                onClick={handleClick}
                className="w-full text-left text-wrap py-2.5 hover:bg-gray-100 cursor-pointer transition-colors"
            >
                <span className="text-sm text-gray-800">{suggestion}</span>
            </button>
        </li>
    );
};

export default SuggestionItem;
