import { describe, expect, it } from "vitest"
import { groupArrayPerPage } from "@/presentation/helpers/array"

describe("groupArrayPerPage", () => {
    it("groups the array into chunks using the provided page size", () => {
        expect(groupArrayPerPage([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    })

    it("returns an empty array when the input array is empty", () => {
        expect(groupArrayPerPage([], 3)).toEqual([])
    })

    it("returns a single page when page size is larger than the array", () => {
        expect(groupArrayPerPage(["a", "b"], 10)).toEqual([["a", "b"]])
    })
})
