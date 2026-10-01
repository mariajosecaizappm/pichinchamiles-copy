import { CalendarDate } from "@internationalized/date";
import type { DateValue, RangeValue } from "@heroui/react";

export const RANGE_QUERY_PARAM = "range";
export const MAX_RANGE_DAYS = 30;

const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_RANGE_REGEX = /^(\d{4}-\d{2}-\d{2})\s*[,_]\s*(\d{4}-\d{2}-\d{2})$/;

const buildCalendarDate = (year: number, month: number, day: number): CalendarDate | null => {
    if (
        Number.isNaN(year) ||
        Number.isNaN(month) ||
        Number.isNaN(day) ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
    ) {
        return null;
    }

    try {
        return new CalendarDate(year, month, day);
    } catch {
        return null;
    }
};

const normalizeYear = (value: string): number => {
    const parsedYear = Number(value);
    return value.length === 2 ? 2000 + parsedYear : parsedYear;
};

const parseIsoDate = (value: string): CalendarDate | null => {
    const match = ISO_DATE_REGEX.exec(value);

    if (!match) return null;

    return buildCalendarDate(Number(match[1]), Number(match[2]), Number(match[3]));
};

const parseSlashDate = (value: string): CalendarDate | null => {
    const parts = value.split("/").map((part) => part.trim());

    if (parts.length !== 3) return null;

    const [day, month, year] = parts;

    if (day.length !== 2 || month.length !== 2 || (year.length !== 2 && year.length !== 4)) {
        return null;
    }

    return buildCalendarDate(normalizeYear(year), Number(month), Number(day));
};

const serializeDate = (value: DateValue): string => {
    const year = String(value.year);
    const month = String(value.month).padStart(2, "0");
    const day = String(value.day).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const serializeRange = (value: RangeValue<DateValue>): string => {
    return `${serializeDate(value.start)},${serializeDate(value.end)}`;
};

const toUtcTime = (value: DateValue): number => {
    return Date.UTC(value.year, value.month - 1, value.day);
};

export const exceedsMaxRangeDays = (value: RangeValue<DateValue>, maxDays: number = MAX_RANGE_DAYS): boolean => {
    const millisecondsDiff = Math.abs(toUtcTime(value.end) - toUtcTime(value.start));
    const inclusiveDays = Math.floor(millisecondsDiff / (1000 * 60 * 60 * 24)) + 1;

    return inclusiveDays > maxDays;
};

export const parseRangeParam = (value: string | null): RangeValue<DateValue> | null => {
    if (!value) return null;

    const normalizedValue = decodeURIComponent(value).trim();
    const isoMatch = ISO_RANGE_REGEX.exec(normalizedValue);

    if (isoMatch) {
        const start = parseIsoDate(isoMatch[1]);
        const end = parseIsoDate(isoMatch[2]);

        return start && end ? { start, end } : null;
    }

    const slashParts = normalizedValue.split("-").map((part) => part.trim());

    if (slashParts.length !== 2) return null;

    const [startValue, endValue] = slashParts;
    const start = parseSlashDate(startValue);
    const end = parseSlashDate(endValue);

    return start && end ? { start, end } : null;
};
