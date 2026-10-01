import React from 'react';
import { LeftArrow } from '@/presentation/components/ScrollMenu/LeftArrow';

interface LeftArrowWithMobileProps {
    showArrowsOnMobile: boolean;
    infinite?: boolean;
}

const LeftArrowWithMobile: React.FC<LeftArrowWithMobileProps> = ({ showArrowsOnMobile, infinite = false }) => (
    <LeftArrow className={showArrowsOnMobile ? '' : 'hidden lg:flex'} infinite={infinite} />
);

export default LeftArrowWithMobile;
