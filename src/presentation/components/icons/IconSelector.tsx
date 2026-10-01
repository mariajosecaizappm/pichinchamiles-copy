import React from 'react';

export interface IconSelectorProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    width?: number | string;
    height?: number | string;
}

export const IconSelector = ({ 
    size = 24, 
    color = 'currentColor', 
    width, 
    height, 
    ...props 
}: IconSelectorProps) => {
    return (
        <svg 
            width={width ?? size} 
            height={height ?? size} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M7 10L12 15L17 10H7Z" fill={color} />
        </svg>
    );
};

export default IconSelector;
