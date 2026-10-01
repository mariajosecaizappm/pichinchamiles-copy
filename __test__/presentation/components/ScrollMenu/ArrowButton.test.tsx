
import { ArrowButton } from '@/presentation/components/ScrollMenu/ArrowButton';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ArrowButton', () => {
    const mockOnClick = vi.fn();

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    it('renders button with children', () => {
        render(
            <ArrowButton disabled={false} onClick={mockOnClick}>
                <span data-testid="arrow-icon">Arrow</span>
            </ArrowButton>
        );

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        render(
            <ArrowButton disabled={false} onClick={mockOnClick}>
                <span>Arrow</span>
            </ArrowButton>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(
            <ArrowButton disabled={true} onClick={mockOnClick}>
                <span>Arrow</span>
            </ArrowButton>
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();

        fireEvent.click(button);
        expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('applies custom className', () => {
        render(
            <ArrowButton disabled={false} onClick={mockOnClick} className="custom-class">
                <span>Arrow</span>
            </ArrowButton>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('has default classes', () => {
        render(
            <ArrowButton disabled={false} onClick={mockOnClick}>
                <span>Arrow</span>
            </ArrowButton>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveClass('absolute', 'top-1/2', 'cursor-pointer', '-translate-y-1/2', 'z-10', 'min-w-10', 'w-10', 'h-10', 'rounded-sm', 'bg-blue-500', 'p-0', 'items-center', 'justify-center', 'flex');
    });

    describe('accessibility', () => {
        it('should apply aria-label to the button', () => {
            render(
                <ArrowButton disabled={false} onClick={mockOnClick} aria-label="Anterior">
                    <span>Arrow</span>
                </ArrowButton>
            );
            expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument();
        });

        it('should apply aria-label="Siguiente" correctly', () => {
            render(
                <ArrowButton disabled={false} onClick={mockOnClick} aria-label="Siguiente">
                    <span>Arrow</span>
                </ArrowButton>
            );
            expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument();
        });

        it('should wrap children in an aria-hidden span to avoid double reading', () => {
            const { container } = render(
                <ArrowButton disabled={false} onClick={mockOnClick} aria-label="Anterior">
                    <span data-testid="icon">◀</span>
                </ArrowButton>
            );
            const hiddenSpan = container.querySelector("span[aria-hidden='true']");
            expect(hiddenSpan).toBeInTheDocument();
            expect(hiddenSpan).toContainElement(screen.getByTestId('icon'));
        });

        it('should render button without aria-label when prop is not provided', () => {
            const { container } = render(
                <ArrowButton disabled={false} onClick={mockOnClick}>
                    <span>Arrow</span>
                </ArrowButton>
            );
            expect(container.querySelector('button')).not.toHaveAttribute('aria-label');
        });
    });
});
