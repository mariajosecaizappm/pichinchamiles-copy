import { AlgoliaHit } from "@/data/provider/algolia/types";
import { Category, ProgramCategory } from "@/domain/entity/Category/structure/category";
import { getString, isRecord } from "../commonAdapters";

export const getCategoryAdapter = (hitValue: AlgoliaHit): Category => {
    const record = isRecord(hitValue) ? hitValue : {}
    const programId = process.env.NEXT_PUBLIC_PROGRAM_ID as string;
    const programCategories = (hitValue as { programCategories?: ProgramCategory[] })?.programCategories || [];
    const programCategory = programCategories.find((programCategory) => programCategory.programId === programId);

    return {
        id: getString(record.id),
        name: getString(record.name),
        slug: getString(record.slug),
        parent: record.parentId && record.parentSlug ? {
            id: getString(record.parentId),
            slug: getString(record.parentSlug)
        } : null,
        description: getString(record.description),
        showName: getString(record.slug),

        icon: programCategory ? programCategory.iconUrl : undefined
    }
}