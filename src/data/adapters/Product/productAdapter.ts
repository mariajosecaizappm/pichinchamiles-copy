import { AlgoliaHit } from "@/data/provider/algolia/types";
import { OptionOrdered, Product, ProductAsset, ProductFeature, ProductSuggestion, ProductTag, ProductType } from "@/domain/entity/Product/product";
import { getArray, getBoolean, getNumber, getString, isRecord } from "../commonAdapters";
import { AlgoliaSearchEngine } from "@/domain/entity/SearchEngine/structure/SearchEngine";

export const getProductAdapter = (hitValue: AlgoliaHit, searchEngine: AlgoliaSearchEngine): Product => {
    const record = isRecord(hitValue) ? hitValue : {};
    return {
        id: getString(record.id),
        name: getString(record.name),
        slug: getString(record.slug),
        keywords: getString(record.keywords),
        seoTitle: getString(record.seoTitle),
        seoKeywords: getString(record.seoKeywords),
        seoDescription: getString(record.seoDescription),
        description: getString(record.description),
        summary: getString(record.summary),
        brand: {
            id: getString((record.brand as Record<string, unknown>)?.brandId),
            name: getString((record.brand as Record<string, unknown>)?.name)
        },
        categories: getArray(record.categories).map((category: unknown) => {
            const isCategoriesRecord = isRecord(category);
            return {
                id: getString(isCategoriesRecord ? (category.categoryId ?? category.id) : undefined),
                name: getString(isCategoriesRecord ? category.name : undefined),
                slug: getString(isCategoriesRecord ? category.slug : undefined)
            }
        }),
        minPrice: getNumber(record.minPrice),
        recommended: getBoolean(record.recommended),
        segmentCodes: getArray(record.segmentCodes).map(getString),
        store: {
            id: getString((record.store as Record<string, unknown>)?.storeId),
            name: getString((record.store as Record<string, unknown>)?.name)
        },
        supplierId: getString(record.supplierId),
        priority: getNumber(record.priority),
        maxPrice: getNumber(record.maxPrice),
        minPointsPrice: getNumber(record.minPointsPrice),
        maxPointsPrice: getNumber(record.maxPointsPrice),
        unitPointsPriceWithoutDiscount: getNumber(record.unitPointsPriceWithoutDiscount),
        assets: getArray(record.assets).map(getProductAssetAdapter).filter(asset => Boolean(asset.desktopUrl)),
        features: getArray(record.features).map((feature) => {
            const isFeatureRecord = isRecord(feature);
            return {
                id: getString(isFeatureRecord ? feature.id : undefined),
                name: getString(isFeatureRecord ? feature.name : undefined),
                options: isFeatureRecord ? feature.options : undefined,
                optionsOrdered: isFeatureRecord ? orderVariations(feature.options as string[]) : undefined,
            } as ProductFeature
        }),
        tags: record.tags ? getProductTagsAdapter(getArray(record.tags)) : undefined,
        mostWanted: getBoolean(record.mostWanted),
        productType: getString(record.productType) as ProductType,
        searchEngine
    }
}

export const getProductSuggestionAdapter = (hitValue: AlgoliaHit): ProductSuggestion => {
    const record = isRecord(hitValue) ? hitValue : {};

    return {
        query: getString(record.query),
        popularity: getNumber(record.popularity),
        objectID: getString(record.objectID)
    }
}

export const getProductTagsAdapter = (tags: unknown[]): ProductTag[] => {
    return tags.map((tag: unknown) => ({
        tag: getString((tag as Record<string, unknown>)?.tag),
        textColor: getString((tag as Record<string, unknown>)?.tagTextColor),
        backgroundColor: getString((tag as Record<string, unknown>)?.tagBackgroundColor)
    }))
}

const INVALID_URL_VALUES = new Set(['', 'undefined', 'null']);


const sanitizeUrl = (value: unknown): string => {
    const str = getString(value);
    return INVALID_URL_VALUES.has(str) ? '' : str;
};

export const getProductAssetAdapter = (raw: unknown): ProductAsset => {
    const r = isRecord(raw) ? raw : {};
    const desktopUrl = sanitizeUrl(r.desktopUrl);
    return {
        id: getString(r.id),
        type: getString(r.type) === 'video' ? 'video' : 'image',
        htmlAlternative: getString(r.htmlAlternative) || undefined,
        order: getNumber(r.order),
        desktopUrl,
        mobileUrl: sanitizeUrl(r.mobileUrl) || desktopUrl,
    };
};

export const orderVariations = (variations: ProductFeature[] | string[]) => {
    const compositeMeasures = [
        //Sizes
        "19-20", "20-21", "22-23", "23-24", "23-25", "24-25", "25-26", "27-28",
        "28-29", "29-30", "30-31", "32-33", "33-34", "34-35", "35-36", "36-37", "37-38", "38-39",
        "39-40", "41-42", "42-43", "43-44", "45-46", "46-47", "xxxs", "xxs", "xs", "s", "m", "l",
        "xl", "xxl", "xxxl", "xxxxl", "recién nacido", "0 meses", "1 mes", "2 meses", "3 meses",
        "4 meses", "6 meses", "8 meses", "9 meses", "12 meses", "16 meses", "17 meses", "18 meses",
        "19 meses", "24 meses", "36 meses", "0-1 meses", "1-2 meses", "0-3 meses", "2-4 meses",
        "3-6 meses", "4-6 meses", "6-9 meses", "9-12 meses", "12-18 meses", "2 años", "3 años",
        "4 años", "5 años", "6 años", "7 años", "8 años", "9 años", "10 años", "12 años", "14 años",
        "16 años", "1-2 años", "2-3 años", "3-4 años", "4-5 años", "5-6 años", "6-7 años", "7-8 años",
        "8-9 años", "9-10 años", "10-11 años", "11-12 años", "12-13 años", "13-14 años", "14-15 años",
        "15-16 años", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8", "7 3/4", "7 7/8",
        //Range
        "0 meses +", "+ 0 meses", "+ 6 meses", "1 mes +", "3 meses +", "+ 6 meses",
        "6+ meses", "8 meses +", "9 meses +", "10 meses +", "12 meses +", "18 meses +",
        "24 meses +", "36 meses +", "0 años +", "1 año +", "2 años +", "3 años +", "3+ años",
        "4 años +", "4+ años", "5 años +", "5+ años", "6 años +", "6+ años", "7 años +",
        "8 años +", "8 años+", "8+ años", "9 años +", "10 años +", "12 años +", "14 años +",
        "16 años +", "1 a 3 años", "2 a 6 años", "3 a 6 años", "3 a 7 años", "3 a 8 años",
        "5 a 8 años", "2 a 6 meses", "6 a 30 meses",
        "6 a 36 meses", "12 a 36 meses", "18 a 36 meses",
    ];
    const upperCaseLabelOptions = [
        "xxxs", "xxs", "xs", "s", "m", "l",
        "xl", "xxl", "xxxl", "xxxxl",
    ];


    const orderedCompositeMeasure = Object.fromEntries(compositeMeasures.map((size, index) => [size, index]));
    const checkUpperCaseOptions = (label: string) => {
        return upperCaseLabelOptions.some(item => item === label.toLowerCase());
    }

    const getVariationLabel = (option: unknown): string => {
        if (typeof option === 'number') {
            return option.toString();
        }

        if (typeof option === 'string') {
            return option.toLocaleLowerCase();
        }

        if (isRecord(option)) {
            const value = option.options;
            if (Array.isArray(value)) {
                return getString(value[0]).toLocaleLowerCase();
            }
            return getString(value).toLocaleLowerCase();
        }

        return '';
    };

    const compareValues = (a: string, b: string): number => {
        const valueA = deleteCharacters(a);
        const valueB = deleteCharacters(b);
        if (isNaN(Number(valueA)) && isNaN(Number(valueB))) {
            return valueA.localeCompare(valueB);
        } else {
            return Number(valueA) - Number(valueB);
        }
    };

    if (variations.length > 0) {
        let newTallas;

        if (variations.some((i) => orderedCompositeMeasure[getVariationLabel(i)] !== undefined)) {
            newTallas = variations.sort((a, b) => {
                return (orderedCompositeMeasure[getVariationLabel(a)] ?? Infinity) -
                    (orderedCompositeMeasure[getVariationLabel(b)] ?? Infinity);
            });
        } else if (
            Array.isArray(variations) &&
            variations.every(item => typeof item === 'string') &&
            new RegExp(NumberValidator).test(variations[0].toString())) {
            newTallas = variations.slice().sort((a, b) => {
                const item1 = typeof a === 'object' ? (a as ProductFeature).options[0] : a;
                const item2 = typeof b === 'object' ? (b as ProductFeature).options[0] : b;
                return Number(item1) - Number(item2);
            });
        } else {
            newTallas = variations.sort((a, b) => compareValues(getVariationLabel(a), getVariationLabel(b)));
        }

        const options: OptionOrdered[] = [];

        newTallas.forEach((talla, index) => {
            if (typeof talla === 'string')
                options[index] = { id: talla, name: (checkUpperCaseOptions(talla) ? talla.toUpperCase() : talla) };
        })
        return options;
    }

    return [];
};


const deleteCharacters = (word: string): string => {
    const specialCharacter = ['\\$', 'ml', 'watts', 'kilos', 'metro', 'metros', '"',
        'litros', 'litro', 'libra', 'libras', 'quemador', 'quemadores', 'pieza', 'piezas',
        'unidad', 'unidades', 'gramo', 'gramos', 'kilogramos']

    specialCharacter.forEach(elemento => {
        word = word.replace(new RegExp(elemento, 'g'), "");
    });

    return word;
}

const NumberValidator = /^\d*$/;