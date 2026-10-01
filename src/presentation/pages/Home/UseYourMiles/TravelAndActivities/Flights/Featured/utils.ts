import { Banner } from "@/domain/entity/Banner/banner";

export const getFeaturedBannerCardFields = (item: Banner) => {
    const summary = item.summary?.trim() ?? "";
    const description = item.description?.trim() ?? "";
    const summaryAsNumber = Number(summary);
    const summaryIsMiles = summary !== "" && Number.isFinite(summaryAsNumber);

    if (summaryIsMiles) {
        return {
            address: description || undefined,
            points: summaryAsNumber,
        };
    }

    const descriptionAsNumber = Number(description);
    return {
        address: summary || undefined,
        points: description !== "" && Number.isFinite(descriptionAsNumber) ? descriptionAsNumber : 0,
    };
};
