
export const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
}

export const getString = (value: unknown): string => {
    return typeof value === "string" ? value : "";
}

export const getBoolean = (value: unknown): boolean => {
    return typeof value === "boolean" ? value : false;
}

export const getArray = (value: unknown): unknown[] => {
    return Array.isArray(value) ? value : [];
}

export const getNumber = (value: unknown): number => {
    if (typeof value === "number") return value;
    const parsed = typeof value === "string" ? Number.parseFloat(value) : Number.NaN;
    return Number.isFinite(parsed) ? parsed : 0;
}