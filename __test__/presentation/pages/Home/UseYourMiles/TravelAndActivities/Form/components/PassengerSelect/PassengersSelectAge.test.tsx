import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import PassengersSelectAge from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect/PassengersSelectAge"
import FormContext from "@/presentation/components/Form/context/FormContext"

// Mock FormSelect
vi.mock("@/presentation/components/Form/controls/FormSelect/FormSelect", () => ({
    default: ({ name, options, defaultSelectedKeys, classNames, listboxProps }: {
        name: string;
        options: unknown[];
        defaultSelectedKeys: string[];
        classNames?: Record<string, string>;
        listboxProps?: Record<string, unknown>;
    }) => (
        <div data-testid={`form-select-${name}`}>
            <div data-testid="form-select-name">{name}</div>
            <div data-testid="form-select-options-count">{options?.length || 0}</div>
            <div data-testid="form-select-default-keys">{JSON.stringify(defaultSelectedKeys)}</div>
            <div data-testid="form-select-class-names">{JSON.stringify(classNames)}</div>
            <div data-testid="form-select-listbox-props">{JSON.stringify(listboxProps)}</div>
        </div>
    )
}))

// Mock MAX_CHILDREN_AGES
vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Hotels/Form/HotelsFormConfig", () => ({
    MAX_CHILDREN_AGES: 17
}))

describe("PassengersSelectAge", () => {
    const mockFormContext = {
        values: {},
        errors: {},
        touched: {},
        onInputChange: vi.fn(),
        setFieldValue: vi.fn(),
        onBlur: vi.fn(),
        isSubmitting: false,
        submitCount: 0,
        disabled: false,
        hasErrors: false,
        alert: null
    }

    const renderWithFormContext = (component: React.ReactElement, contextValue = mockFormContext) => {
        return render(
            <FormContext.Provider value={contextValue}>
                {component}
            </FormContext.Provider>
        )
    }

    it("should render nothing when childrenCount is 0", () => {
        const { container } = renderWithFormContext(
            <PassengersSelectAge childrenCount={0} />
        )

        expect(container.firstChild).toBeNull()
    })

    it("should render age inputs when childrenCount > 0", () => {
        renderWithFormContext(
            <PassengersSelectAge childrenCount={2} />
        )

        expect(screen.getByTestId("form-select-ageChildren1")).toBeInTheDocument()
        expect(screen.getByTestId("form-select-ageChildren2")).toBeInTheDocument()
        expect(screen.queryByTestId("form-select-ageChildren3")).not.toBeInTheDocument()
    })

    it("should render correct number of age inputs", () => {
        renderWithFormContext(
            <PassengersSelectAge childrenCount={3} />
        )

        expect(screen.getByTestId("form-select-ageChildren1")).toBeInTheDocument()
        expect(screen.getByTestId("form-select-ageChildren2")).toBeInTheDocument()
        expect(screen.getByTestId("form-select-ageChildren3")).toBeInTheDocument()
        expect(screen.queryByTestId("form-select-ageChildren4")).not.toBeInTheDocument()
    })

    it("should render with correct labels", () => {
        renderWithFormContext(
            <PassengersSelectAge childrenCount={1} />
        )

        expect(screen.getByText("Edad del menor")).toBeInTheDocument()
    })

    it("should pass correct props to FormSelect components", () => {
        renderWithFormContext(
            <PassengersSelectAge childrenCount={1} />
        )

        expect(screen.getByTestId("form-select-name")).toHaveTextContent("ageChildren1")
        expect(screen.getByTestId("form-select-options-count")).toHaveTextContent("17") // MAX_CHILDREN_AGES
        expect(screen.getByTestId("form-select-default-keys")).toHaveTextContent('["1"]')
    })

    it("should apply custom classNames", () => {
        renderWithFormContext(
            <PassengersSelectAge 
                childrenCount={1} 
                classNames={{
                    trigger: "h-[33.66px] min-h-[33.66px] px-[20px]"
                }}
            />
        )

        const classNamesText = screen.getByTestId("form-select-class-names").textContent
        expect(classNamesText).toContain('h-[33.66px] min-h-[33.66px] px-[20px]')
    })

    it("should apply listboxProps", () => {
        renderWithFormContext(
            <PassengersSelectAge 
                childrenCount={1} 
                listboxProps={{
                    itemClasses: {
                        base: 'h-[33.66px]'
                    }
                }}
            />
        )

        const listboxPropsText = screen.getByTestId("form-select-listbox-props").textContent
        expect(listboxPropsText).toContain('h-[33.66px]')
    })

    it("should render with custom className", () => {
        const { container } = renderWithFormContext(
            <PassengersSelectAge 
                childrenCount={1} 
                className="custom-class"
            />
        )

        const wrapper = container.firstChild as HTMLElement
        expect(wrapper).toHaveClass("custom-class")
    })

    it("should render correct structure for multiple children", () => {
        renderWithFormContext(
            <PassengersSelectAge childrenCount={2} />
        )

        // Check that both age inputs are rendered
        expect(screen.getByTestId("form-select-ageChildren1")).toBeInTheDocument()
        expect(screen.getByTestId("form-select-ageChildren2")).toBeInTheDocument()

        // Check that each has the correct label
        const labels = screen.getAllByText("Edad del menor")
        expect(labels).toHaveLength(2)
    })

    it("should generate correct age options", () => {
        renderWithFormContext(
            <PassengersSelectAge childrenCount={1} />
        )

        // The component should generate options from 1 to MAX_CHILDREN_AGES (17)
        expect(screen.getByTestId("form-select-options-count")).toHaveTextContent("17")
    })

    it("should have unique keys for each child input", () => {
        renderWithFormContext(
            <PassengersSelectAge childrenCount={3} />
        )

        // Each child should have a unique name based on their index
        expect(screen.getByTestId("form-select-ageChildren1")).toBeInTheDocument()
        expect(screen.getByTestId("form-select-ageChildren2")).toBeInTheDocument()
        expect(screen.getByTestId("form-select-ageChildren3")).toBeInTheDocument()
    })

    it("should render iconColor prop", () => {
        renderWithFormContext(
            <PassengersSelectAge 
                childrenCount={1} 
                iconColor="#0F265C"
            />
        )

        // The iconColor should be passed through to FormSelect
        // This is tested indirectly by ensuring the component renders without errors
        expect(screen.getByTestId("form-select-ageChildren1")).toBeInTheDocument()
    })
})
