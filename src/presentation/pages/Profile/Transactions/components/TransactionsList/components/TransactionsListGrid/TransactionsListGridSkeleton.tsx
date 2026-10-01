import React from 'react';
import {Skeleton} from "@heroui/react";

const groupIds = ["group-1", "group-2"];
const transactionIds = ["transaction-1", "transaction-2", "transaction-3"];

const TransactionsListGridSkeleton = () => {
    return (
        <div className="flex flex-col gap-3 mt-2">
            <Skeleton className="h-4 w-40 rounded" />

            {groupIds.map((groupId) => (
                <div key={groupId} className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-32 rounded" />

                    <div className="flex flex-col gap-3 md:gap-0 md:overflow-hidden md:rounded-lg md:border md:border-darkGrayishBlue-300 md:bg-white">
                        {transactionIds.map((transactionId) => (
                            <div
                                key={`${groupId}-${transactionId}`}
                                className="border border-darkGrayishBlue-300 rounded-lg py-[14px] px-3 flex items-center gap-2 md:rounded-none md:border-0 md:border-b md:border-darkGrayishBlue-300 md:px-6 md:py-6 md:last:border-b-0"
                            >
                                <Skeleton className="h-4 flex-1 rounded" />
                                <Skeleton className="h-4 w-28 rounded shrink-0" />
                                <Skeleton className="size-4 rounded shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="flex justify-center pt-3 md:pb-3 md:pt-6">
                <Skeleton className="h-10 w-56 rounded-xl" />
            </div>
        </div>
    );
};

export default TransactionsListGridSkeleton;
