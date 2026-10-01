"use client"

import Accordion from "@/presentation/components/Accordion"
import StickyNavWrapper from "@/presentation/pages/Home/UseYourMiles/Layout/components/StickyNavWrapper"
import OrdersSearchBar from "../OrdersSearchBar"
import OrdersHeader from "./OrdersHeader"
import OrdersInfoList from "../OrdersInfo"
import OrdersInfoHeader from "../OrdersInfo/OrdersInfoHeader"
import { Divider } from "@heroui/react"

type Props = {
    children: React.ReactNode
    orderNumber: string
    onSearch: (value: string) => void
    onClearSearch: () => void
    isClearingSearch?: boolean
}

const OrdersLayout = ({ children, orderNumber, onSearch, onClearSearch, isClearingSearch = false }: Props) => {
    return (
        <div className="flex flex-col mt-2">
            <div className="body-container pt-4">
                <OrdersHeader />
            </div>
            <StickyNavWrapper className="sticky top-[90px] md:top-[73px] z-40 bg-white space-y-4 py-4 md:pb-0">
                <div className="body-container">
                    <OrdersSearchBar value={orderNumber} onSearch={onSearch} onClear={onClearSearch} isClearing={isClearingSearch} />
                </div>
                            
                <div className="body-container md:hidden">
                    <Accordion
                        triggerClassName="pt-0 pb-4 border-b border-darkGrayishBlue-300"
                        itemClassName="py-0"
                        items={[
                            {
                                id: "order-details",
                                title: (
                                    <OrdersInfoHeader />
                                ),
                                content: (
                                    <div className="pt-4">
                                        <div className="space-y-3">
                                            <OrdersInfoList />
                                            <Divider />
                                        </div>
                                    </div>
                                )
                            }
                        ]}
                    />
                </div>
            </StickyNavWrapper>
            <div className="space-y-3 body-container pb-4">
                <div className="flex gap-2.5">
                    <div className="flex-1">
                        {children}
                    </div>
                    <div className="hidden md:flex md:sticky md:top-[150px] md:self-start flex-col gap-4 w-100">
                        <div className="p-1">
                            <OrdersInfoHeader />
                        </div>
                        <OrdersInfoList />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrdersLayout