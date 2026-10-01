import React from 'react';
import { SectionBanner } from '@/presentation/components/Banner/SectionBanner/';
import type { Banner } from '@/domain/entity/Banner/banner';


interface MarketingBannersProps {
    banners: Banner[]
}

const MarketingBanners: React.FC<MarketingBannersProps> = ({ banners }) => {
    if (banners.length === 0) return null;
    return (
        <div className="grid lg:grid-cols-2 gap-2.5">
            {banners.map((banner, index) => (
                <div key={banner.id} className={index === 0 ? 'lg:col-span-2' : ''}>
                    <SectionBanner
                        title={banner.title}
                        subtitle={banner.subtitle}
                        buttonText={banner.linkText}
                        linkButton={banner.link}
                        backgroundImage={banner.image}
                        className={`w-full h-100 md:h-70 ${index !== 0 ? 'lg:h-49' : ''}`}
                    />
                </div>
            ))}
        </div>
    );
};

export default MarketingBanners;
