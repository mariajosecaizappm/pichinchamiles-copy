import { cn, Skeleton } from "@heroui/react"
import styles from '../../OrderCardItem/OrderCardItem.module.css'
import IconCar2 from "@/presentation/components/icons/IconCar2"

const OrderItemSkeleton = () => {
    return (
        <div className={cn(styles.orderCard, "cursor-not-allowed!")}>
            <div className={styles.orderCardHeader}>
                <div className={styles.orderCardHeaderInfo}>
                    <span className={styles.orderCardHeaderIcon}>
                        <IconCar2 />
                    </span>
                    <Skeleton className="h-6 w-full rounded-sm bg-darkGrayishBlue-200 max-w-55" />
                </div>
                <Skeleton className="h-6 w-20 rounded-sm bg-darkGrayishBlue-200" />
            </div>
            <div className={styles.orderCardBody}>
                <Skeleton className="h-4 rounded-sm bg-darkGrayishBlue-200 mt-1 max-w-54 md:max-w-78" />
                <Skeleton className="h-4 rounded-sm bg-darkGrayishBlue-200 mt-1 max-w-30" />
            </div>
        </div>
    )
}

export default OrderItemSkeleton
