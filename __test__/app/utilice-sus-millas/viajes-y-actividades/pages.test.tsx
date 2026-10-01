import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

import { ActivityKey } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/TravelAndActivitiesConfig"

const mockNotFound = vi.fn()

vi.mock("react-responsive-carousel/lib/styles/carousel.min.css", () => ({}))

vi.mock("next/navigation", () => ({
    notFound: () => mockNotFound(),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form", () => ({
    default: () => <div data-testid="flights-form">FlightsForm</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Hotels/Form/HotelsForm", () => ({
    default: () => <div data-testid="hotels-form">HotelsForm</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars/Form/CarsForm", () => ({
    default: () => <div data-testid="cars-form">CarsForm</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Activities/Form/ActivitiesForm", () => ({
    default: () => <div data-testid="activities-form">ActivitiesForm</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Disney/Form", () => ({
    default: () => <div data-testid="disney-form">DisneyForm</div>,
}))

import TravelAndActivities from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/TravelAndActivities"
import TravelAndActivitiesPage from "@/app/utilice-sus-millas/(main)/viajes-y-actividades/[activity]/page"

describe("viajes-y-actividades [activity] page", () => {

    it("should pass activity param to TravelAndActivities", async () => {
        const page = await TravelAndActivitiesPage({ params: Promise.resolve({ activity: "vuelos" }) })
        expect(page.props.activity).toBe("vuelos")
    })

    it("should render FlightsForm for vuelos activity", async () => {
        const result = await TravelAndActivities({ activity: "vuelos" })
        render(result)
        expect(screen.getByTestId("flights-form")).toBeInTheDocument()
    })

    it("should render HotelsForm for hoteles activity", async () => {
        const result = await TravelAndActivities({ activity: "hoteles" })
        render(result)
        expect(screen.getByTestId("hotels-form")).toBeInTheDocument()
    })

    it("should render CarsForm for autos activity", async () => {
        const result = await TravelAndActivities({ activity: "autos" })
        render(result)
        expect(screen.getByTestId("cars-form")).toBeInTheDocument()
    })

    it("should render ActivitiesForm for actividades activity", async () => {
        const result = await TravelAndActivities({ activity: "actividades" })
        render(result)
        expect(screen.getByTestId("activities-form")).toBeInTheDocument()
    })

    it("should render DisneyForm for disney activity", async () => {
        const result = await TravelAndActivities({ activity: "disney" })
        render(result)
        expect(screen.getByTestId("disney-form")).toBeInTheDocument()
    })

    it("should call notFound for unknown activity", async () => {
        await TravelAndActivities({ activity: "unknown" as ActivityKey })
        expect(mockNotFound).toHaveBeenCalled()
    })
})
