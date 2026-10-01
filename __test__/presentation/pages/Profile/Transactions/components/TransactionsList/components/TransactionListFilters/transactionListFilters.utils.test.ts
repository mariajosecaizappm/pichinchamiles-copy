import { describe, expect, it } from "vitest";
import { CalendarDate } from "@internationalized/date";
import { parseRangeParam, RANGE_QUERY_PARAM, serializeRange } from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionListFilters/transactionListFilters.utils";

describe("transactionListFilters.utils", () => {
    it("exposes the expected query param key", () => {
        expect(RANGE_QUERY_PARAM).toBe("range");
    });

    it("serializes a date range to iso values", () => {
        const result = serializeRange({
            start: new CalendarDate(2026, 7, 1),
            end: new CalendarDate(2026, 7, 16),
        });

        expect(result).toBe("2026-07-01,2026-07-16");
    });

    it("parses iso ranges separated by comma", () => {
        const result = parseRangeParam("2026-07-01,2026-07-16");

        expect(result).toEqual({
            start: new CalendarDate(2026, 7, 1),
            end: new CalendarDate(2026, 7, 16),
        });
    });

    it("parses iso ranges separated by underscore", () => {
        const result = parseRangeParam("2026-07-01_2026-07-16");

        expect(result).toEqual({
            start: new CalendarDate(2026, 7, 1),
            end: new CalendarDate(2026, 7, 16),
        });
    });

    it("parses slash-formatted ranges and normalizes two-digit years", () => {
        const result = parseRangeParam("01/07/26 - 16/07/2026");

        expect(result).toEqual({
            start: new CalendarDate(2026, 7, 1),
            end: new CalendarDate(2026, 7, 16),
        });
    });

    it("returns null for invalid or incomplete values", () => {
        expect(parseRangeParam(null)).toBeNull();
        expect(parseRangeParam("2026-13-01,2026-07-16")).toBeNull();
        expect(parseRangeParam("bad-value")).toBeNull();
    });
});
