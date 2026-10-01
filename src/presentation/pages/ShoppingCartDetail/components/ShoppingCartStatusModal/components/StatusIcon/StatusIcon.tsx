"use client";

import {PaymentStatus} from "@/domain/entity/Payment/payment";
import SuccessIcon
    from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon/SuccessIcon";
import ErrorIcon
    from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon/ErrorIcon";
import PendingIcon
    from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon/PendingIcon";

type StatusIconProps = {
    status: PaymentStatus
};

const StatusIcon = ({ status }: StatusIconProps) => {

    return (
        <div className={`flex items-center justify-center rounded-full mt-8`}>
            <div className={`flex items-center justify-center rounded-full`}>
                {status === PaymentStatus.SUCCESS
                    &&
                    <SuccessIcon/>
                }
                {status === PaymentStatus.REJECTED
                    &&
                    <ErrorIcon/>
                }
                {status === PaymentStatus.PENDING
                    &&
                    <PendingIcon/>
                }
            </div>
        </div>
    );
};

export default StatusIcon;
