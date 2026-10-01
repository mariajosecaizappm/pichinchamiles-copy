import React from 'react';
import clsx from 'clsx';

export const ArrowButton = ({
    disabled,
    onClick,
    children,
    className = '',
    ariaLabel,
    'aria-label': ariaLabelProp,
}: {
    disabled: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
    ariaLabel?: string;
}) => (
    <button
        type="button"
        aria-label={ariaLabelProp ?? ariaLabel}
        className={clsx('absolute top-1/2 cursor-pointer -translate-y-1/2 z-10 disabled:opacity-45 min-w-10 w-10 h-10 rounded-sm bg-blue-500 p-0 items-center justify-center flex', className)}
        onClick={onClick}
        disabled={disabled}
    >
        <span aria-hidden="true">{children}</span>
    </button>
);
