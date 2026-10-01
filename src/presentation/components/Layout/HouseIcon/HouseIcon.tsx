import React from 'react';

interface HouseIconProps {
    className?: string;
    width?: number;
    height?: number;
    color?: string;
}

const HouseIcon: React.FC<HouseIconProps> = ({ 
    className = '',
    width = 20,
    height = 17,
    color = '#6E6E73'
}) => {
    return (
        <svg 
            width={width} 
            height={height} 
            viewBox="0 0 20 17" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path 
                d="M10 2.69L15 7.19V15H13V9H7V15H5V7.19L10 2.69ZM10 0L0 9H3V17H9V11H11V17H17V9H20L10 0Z" 
                fill={color}
            />
        </svg>
    );
};

export default HouseIcon;
