import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import UtiliceSusMillasMainLayout from '@/app/utilice-sus-millas/(main)/layout'
import '@testing-library/jest-dom'

// Mock HomeTabs component
vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/Tabs", () => ({
    default: () => <div data-testid="home-tabs">HomeTabs</div>,
}))

// Mock StickyNavWrapper to avoid IntersectionObserver in jsdom
vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/components/StickyNavWrapper", () => ({
    default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
    ),
}))

const renderLayout = (children: React.ReactNode = <div>Children</div>) =>
    render(
        <UtiliceSusMillasMainLayout
            categories={<div data-testid="categories-slot">Categories Slot</div>}
            subnav={<div data-testid="subnav-slot">Subnav Slot</div>}
        >
            {children}
        </UtiliceSusMillasMainLayout>
    )

describe('UtiliceSusMillasMainLayout', () => {
    it('renders children correctly', () => {
        renderLayout(<div>Test content</div>)

        expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('renders children inside a <main> element', () => {
        renderLayout(<div data-testid="test-child">Test content</div>)

        const main = screen.getByTestId('test-child').closest('main')
        expect(main).toBeInTheDocument()
    })

    it('renders multiple children', () => {
        renderLayout(
            <>
                <div>First child</div>
                <div>Second child</div>
            </>
        )

        expect(screen.getByText('First child')).toBeInTheDocument()
        expect(screen.getByText('Second child')).toBeInTheDocument()
    })

    it('renders HomeTabs and the categories/subnav parallel route slots', () => {
        renderLayout()

        // HomeTabs now renders twice (mobile + desktop views)
        expect(screen.getAllByTestId('home-tabs')).toHaveLength(2)
        // Categories slot renders in both mobile and desktop sticky containers
        expect(screen.getAllByTestId('categories-slot')).toHaveLength(2)
        // Subnav only renders in desktop view
        expect(screen.getByTestId('subnav-slot')).toBeInTheDocument()
    })

    it('applies correct CSS classes to the sticky top container', () => {
        const { container } = renderLayout()

        // Desktop sticky container
        const desktopSticky = container.querySelector('.hidden.md\\:block.md\\:sticky') as HTMLElement
        expect(desktopSticky).toBeInTheDocument()
        expect(desktopSticky).toHaveClass('hidden', 'md:block', 'md:sticky', 'top-0', 'z-50', 'lg:mt-2', 'bg-white')

        // Mobile sticky container
        const mobileSticky = container.querySelector('.md\\:hidden.sticky') as HTMLElement
        expect(mobileSticky).toBeInTheDocument()
        expect(mobileSticky).toHaveClass('md:hidden', 'sticky', 'top-0', 'z-50', 'bg-white')
    })

    it('renders HomeTabs before the children <main>', () => {
        renderLayout(<div data-testid="test-children">Test Children</div>)

        const homeTabs = screen.getAllByTestId('home-tabs')[0] // First (mobile) instance
        const testChildren = screen.getByTestId('test-children')

        // HomeTabs should come before the children in document order
        expect(
            homeTabs.compareDocumentPosition(testChildren) & Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy()

        // Children should be inside <main>, HomeTabs should not
        expect(testChildren.closest('main')).toBeInTheDocument()
        expect(homeTabs.closest('main')).toBeNull()
    })
})
