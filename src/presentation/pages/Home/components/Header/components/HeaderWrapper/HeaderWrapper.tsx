'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import useSession from '@/presentation/hooks/useSession';

interface HeaderWrapperProps {
    children: ReactNode;
}

const HeaderWrapper = ({ children }: HeaderWrapperProps) => {
    const { isLogged } = useSession();

    return (
        <div className={clsx(
            'grid gap-3 grid-cols-[auto_1fr_auto] items-center h-9 md:h-12 w-full',
            {
                'md:max-w-[1272px]': isLogged,
                'md:max-w-[1181px]': !isLogged
            }
        )}>
            {children}
        </div>
    );
};

export default HeaderWrapper;
