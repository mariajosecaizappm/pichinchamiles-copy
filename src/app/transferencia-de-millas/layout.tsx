"use client"

import ProtectedRoute from "@/presentation/components/ProtectedRoute"
import TransferMilesSkeleton from "@/presentation/pages/TransferMiles/TransferMilesSkeleton"

const TransferMilesLayout = ({ children }: { children: React.ReactNode }) => {
    return <ProtectedRoute fallback={<TransferMilesSkeleton />}>{children}</ProtectedRoute>
}

export default TransferMilesLayout
