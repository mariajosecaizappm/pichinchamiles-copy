import { cn, Skeleton } from '@heroui/react'
import styles from './OrderCardItem.module.css'
import IconCar2 from '@/presentation/components/icons/IconCar2'
import { OrderStatus } from '@/domain/entity/Order/order'
import StatusChip from './components/OrderStatusChip'


const PendingOrderCardItem = () => {
    return (
        <div className={cn(styles.orderCard, "cursor-not-allowed!")}>
            <div className={styles.orderCardHeader}>
                <div className={styles.orderCardHeaderInfo}>
                    <span className={styles.orderCardHeaderIcon}>
                        <IconCar2 />
                    </span>
                    <Skeleton className="h-6 w-full rounded-sm bg-darkGrayishBlue-200 max-w-55" />
                </div>
                <StatusChip status={OrderStatus.PENDING} />
            </div>
            <div className={styles.orderCardBody}>
                <Skeleton className="h-4 rounded-sm bg-darkGrayishBlue-200 mt-1 max-w-54 md:max-w-78" />
                <p className={styles.orderCardBodyInfo}>
                    Tu pedido está siendo procesado
                </p>
            </div>
        </div>
    )
}

export default PendingOrderCardItem