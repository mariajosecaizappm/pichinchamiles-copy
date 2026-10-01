import React from 'react';
import { Skeleton } from "@heroui/react";

const TransactionsSummarySkeleton = () => {
    const desktopSectionRows = ["row-1", "row-2", "row-3", "row-4"];

    return (
        <div className="md:grid md:grid-cols-3 md:max-w-[1056px] md:mx-auto md:[grid-template-areas:'total_accreditations_debits'_'transactions_accreditations_debits'] md:gap-4">
            <div className="border border-darkGrayishBlue-300 rounded-lg p-4 [grid-area:total]">
                <Skeleton className="h-4 w-40 rounded mb-2" />
                <Skeleton className="h-8 w-36 rounded" />
            </div>

            <div className="hidden md:block p-4 border border-darkGrayishBlue-300 rounded-lg [grid-area:accreditations]">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-28 rounded" />
                        <Skeleton className="h-7 w-24 rounded" />
                    </div>
                    <div className="space-y-3">
                        {desktopSectionRows.map((rowId) => (
                            <div key={rowId} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-5 rounded-full shrink-0" />
                                    <Skeleton className="h-4 w-24 rounded" />
                                </div>
                                <Skeleton className="h-4 w-16 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="hidden md:block p-4 border border-darkGrayishBlue-300 rounded-lg [grid-area:debits]">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-28 rounded" />
                        <Skeleton className="h-7 w-24 rounded" />
                    </div>
                    <div className="space-y-3">
                        {desktopSectionRows.map((rowId) => (
                            <div key={rowId} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-5 rounded-full shrink-0" />
                                    <Skeleton className="h-4 w-24 rounded" />
                                </div>
                                <Skeleton className="h-4 w-16 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="hidden md:block p-4 border border-darkGrayishBlue-300 rounded-lg [grid-area:transactions]">
                <div className="space-y-4">
                    <Skeleton className="h-5 w-32 rounded" />
                    <div className="space-y-3">
                        {["transfer-1", "transfer-2"].map((rowId) => (
                            <div key={rowId} className="flex items-center justify-between gap-3">
                                <Skeleton className="h-4 w-32 rounded" />
                                <Skeleton className="h-4 w-16 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-3 overflow-hidden md:hidden">
                <div className="flex w-full items-start justify-between gap-3 pt-[12px] pb-4 border-b border-darkGrayishBlue-300">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-44 rounded" />
                        <Skeleton className="h-4 w-40 rounded" />
                    </div>
                    <Skeleton className="size-6 rounded shrink-0" />
                </div>
            </div>
        </div>
    );
};

export default TransactionsSummarySkeleton;
