import { Asset } from '@/domain/entity/Asset/asset';

export interface SectionBannerProps {
    title: string;
    buttonText?: string;
    linkButton: string;
    className?: string;
    children?: React.ReactNode;
    backgroundImage?: Asset;
    typeButton?: 'primary' | "bordered",
    buttonClassName?:string
    subtitle?: string;
}

export type SectionBannerContentProps = Omit<SectionBannerProps, 'backgroundImage'>;
