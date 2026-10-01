import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeaderWrapper from '@/presentation/pages/Home/components/Header/components/HeaderWrapper/HeaderWrapper';

// Mock the useSession hook
const { mockUseSession } = vi.hoisted(() => {
    const mockUseSession = vi.fn();
    mockUseSession.mockReturnValue({ isLogged: false });
    return { mockUseSession };
});

vi.mock('@/presentation/hooks/useSession', () => ({
    default: mockUseSession,
}));

describe('HeaderWrapper', () => {
    it('renders children correctly', () => {
        render(
            <HeaderWrapper>
                <div>Test Content</div>
            </HeaderWrapper>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies md:max-w-[1181px] when user is not logged in', () => {
        mockUseSession.mockReturnValue({ isLogged: false });
        
        const { container } = render(
            <HeaderWrapper>
                <div>Test Content</div>
            </HeaderWrapper>
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('md:max-w-[1181px]');
        expect(wrapper).not.toHaveClass('md:max-w-[1272px]');
    });

    it('applies md:max-w-[1272px] when user is logged in', () => {
        // Mock useSession to return isLogged: true
        mockUseSession.mockReturnValue({ isLogged: true });

        const { container } = render(
            <HeaderWrapper>
                <div>Test Content</div>
            </HeaderWrapper>
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('md:max-w-[1272px]');
        expect(wrapper).not.toHaveClass('md:max-w-[1181px]');
    });

    it('applies base classes correctly', () => {
        const { container } = render(
            <HeaderWrapper>
                <div>Test Content</div>
            </HeaderWrapper>
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('grid');
        expect(wrapper).toHaveClass('gap-3');
        expect(wrapper).toHaveClass('grid-cols-[auto_1fr_auto]');
        expect(wrapper).toHaveClass('items-center');
        expect(wrapper).toHaveClass('h-9');
        expect(wrapper).toHaveClass('md:h-12');
        expect(wrapper).toHaveClass('w-full');
    });

    it('is a client component', () => {
        // The 'use client' directive at the top of the file indicates this is a client component
        // This test ensures the component can be rendered without SSR issues
        expect(() => {
            render(
                <HeaderWrapper>
                    <div>Test Content</div>
                </HeaderWrapper>
            );
        }).not.toThrow();
    });
});
