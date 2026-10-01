import React from 'react';
import { RightArrow } from '@/presentation/components/ScrollMenu/RightArrow';

interface RightArrowWithMobileProps {
    showArrowsOnMobile: boolean;
    infinite?: boolean;
}

const RightArrowWithMobile: React.FC<RightArrowWithMobileProps> = ({ showArrowsOnMobile, infinite = false }) => (
    <RightArrow className={showArrowsOnMobile ? '' : 'hidden lg:flex'} infinite={infinite} />
);

export default RightArrowWithMobile;
