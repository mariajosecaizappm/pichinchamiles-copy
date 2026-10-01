import React from 'react';
import clsx from 'clsx';
import AssetImage from '@/presentation/components/AssetImage';
import { SectionBannerProps } from './type';
import SectionBannerContent from './SectionBannerContent';

const SectionBanner: React.FC<SectionBannerProps> = ({
    title,
    subtitle,
    buttonText,
    linkButton,
    className,
    children,
    backgroundImage,
    typeButton = "primary",
    buttonClassName
}) => {
    const content = (
        <SectionBannerContent
            title={title}
            subtitle={subtitle}
            buttonText={buttonText}
            linkButton={linkButton}
            className={className}
            typeButton={typeButton}
            buttonClassName={buttonClassName}
        >
            {children}
        </SectionBannerContent>
    );

    if (backgroundImage) {
        return (
            <div className={clsx('relative p-3 flex flex-col justify-end gap-3 rounded-lg overflow-hidden', className)}>
                <div>
                    <AssetImage
                        asset={backgroundImage}
                        alt={title}
                        width={412}
                        height={311}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="relative z-10">
                    {content}
                </div>
            </div>
        );
    }

    return content;
};

export default SectionBanner;
