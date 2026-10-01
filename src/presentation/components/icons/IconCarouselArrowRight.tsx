import React from 'react';

interface IconCarouselArrowRightProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
}

const IconCarouselArrowRight = ({ color = "white", width = "8", height = "12", ...props }: IconCarouselArrowRightProps) => {
    return (
        <svg data-testid="carousel-arrow-right-icon" width={width} height={height} viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M1.41 0L0 1.41L4.58 6L0 10.59L1.41 12L7.41 6L1.41 0Z" fill={color}/>
        </svg>
    );
};

export default IconCarouselArrowRight;
