import { AlgoliaHit } from "@/data/provider/algolia/types";
import { Banner } from "@/domain/entity/Banner/banner";
import { MarketingPositions } from "@/domain/entity/Marketing/marketing";

export type BannerPositionDTO = {
    name: string;
    positionId: string;
};

export type BannerDTO = {
    callToAction: string;
    campaignId: string;
    componentType: string;
    description: string;
    desktopBackgroundImageUrl: string;
    id: string;
    isOutstanding: boolean;
    link: string;
    mobileBackgroundImageUrl: string;
    objectID: string;
    positions: BannerPositionDTO[];
    priority: number;
    programId: string;
    segmentCodes: string[];
    status: boolean;
    subtitle: string;
    summary: string;
    textColor: string;
    title: string;
};

export const getBannerAdapter = (hitValue: AlgoliaHit): Banner => {
    const dto = hitValue as BannerDTO;
    return {
        id: dto.id,
        title: dto.title,
        subtitle: dto.subtitle,
        description: dto.description,
        summary: dto.summary,
        link: dto.link,
        priority: dto.priority,
        textColor: dto.textColor,
        isOutstanding: dto.isOutstanding,
        segmentCodes: dto.segmentCodes,
        positions: dto.positions.map((position) => position.name as MarketingPositions),
        linkText: dto.callToAction,
        image: {
            desktopUrl: dto.desktopBackgroundImageUrl,
            mobileUrl: dto.mobileBackgroundImageUrl,
        },
        campaignId: dto.campaignId,
    };
};