import { Category, CategoryGroup } from "@/domain/entity/Category/structure/category";

export default class Categorization {
    private categoryMap: Map<string, CategoryGroup> = new Map();
    private parentMap: Map<string, string | null> = new Map();
    readonly categoryGroups: CategoryGroup[] = [];
    readonly categories: Category[];

    constructor(categories: Category[]) {
        this.categories = categories;

        // First pass: create all category groups
        categories.forEach((category) => {
            this.categoryMap.set(category.slug, { ...category, subcategories: [] });
            this.parentMap.set(category.slug, category.parent ? category.parent.slug : null);
        });

        // Second pass: build the tree, checking parent exists
        categories.forEach(({ slug, parent }) => {
            const category = this.categoryMap.get(slug);
            if (!category) return;

            if (parent && this.categoryMap.has(parent.slug)) {
                const parentCategory = this.categoryMap.get(parent.slug);
                if (parentCategory) {
                    parentCategory?.subcategories?.push(category);
                }
            } else {
                this.categoryGroups.push({ ...category, parent: null });
            }
        });
    }

    getCategoryById(id: string | string[]): CategoryGroup | null {
        return Array.from(this.categoryMap.values()).find((category) => category.id === id) ?? null;
    }

    getCategoryBySlug(slug: string): CategoryGroup | null {
        return this.categoryMap.get(slug) ?? null;
    }

    getSubcategoriesBySlug(slug: string): CategoryGroup[] {
        return this.categoryMap.get(slug)?.subcategories ?? [];
    }

    getCategoryAndSubcategoriesSlugs(slug: string): string[] {
        const category = this.categoryMap.get(slug);
        if (!category) return [];

        const collect = (group: CategoryGroup): string[] => [
            group.slug,
            ...(group.subcategories ?? []).flatMap(collect),
        ];

        return collect(category);
    }

    getCategoryAndSubcategoriesIds(slug: string): string[] {
        const category = this.categoryMap.get(slug);
        if (!category) return [];

        const collect = (group: CategoryGroup): string[] => [
            group.id,
            ...(group.subcategories ?? []).flatMap(collect),
        ];

        return collect(category);
    }

    getCategoryGroupBySlug(slug: string): CategoryGroup | null {
        return this.categoryMap.get(slug) || null;
    }
    
    getParentSlug(slug: string): string | null {
        return this.parentMap.get(slug) || null;
    }
}
