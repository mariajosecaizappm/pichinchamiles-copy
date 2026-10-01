import { render, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

const mockReplace = vi.fn()

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace: mockReplace }),
}))

vi.mock("@/presentation/config/links", () => ({
    default: { flights: "/utilice-sus-millas/viajes-y-actividades/vuelos" },
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/UltraViajesPage/UltraViajesSkeleton", () => ({
    default: () => <div data-testid="skeleton" />,
}))

import ViajesYActividadesPage from "@/app/utilice-sus-millas/(main)/viajes-y-actividades/page"

describe("ViajesYActividadesPage", () => {
    it("should redirect to flights", async () => {
        render(<ViajesYActividadesPage />)
        await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/utilice-sus-millas/viajes-y-actividades/vuelos"))
    })
})
