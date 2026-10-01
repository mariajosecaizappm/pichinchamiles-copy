import React from 'react';

interface IconCarouselArrowLeftProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
}

const IconCarouselArrowLeft = ({ color = "white", width = "8", height = "12", ...props }: IconCarouselArrowLeftProps) => {
    return (
        <svg data-testid="carousel-arrow-left-icon" width={width} height={height} viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M7.41 1.41L6 0L0 6L6 12L7.41 10.59L2.83 6L7.41 1.41Z" fill={color}/>
        </svg>
    );
};

export default IconCarouselArrowLeft;
