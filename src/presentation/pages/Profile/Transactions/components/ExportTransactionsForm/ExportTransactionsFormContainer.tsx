import React, {FC} from 'react';
import ExportTransactionsForm
    from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/ExportTransactionsForm";
import {
    ExportTransactionsFormValues
} from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/ExportTransactionsFormConfig";
import { ExportTransactionsAlertHandler } from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/components/ExportTransactionsStatusModal/types";
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import ExportTransactionsUseCase from "@/domain/interactors/Transactions/ExportTransactionsUseCase";
import useDownload from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/hooks/useDownload";
import { useModal } from "@/presentation/components/Modal";
import ExportTransactionsStatusModal, {
    exportTransactionsModalContent,
} from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/components/ExportTransactionsStatusModal/ExportTransactionsStatusModal";

const EXPORT_TRANSACTIONS_STATUS_MODAL_ID = "exportTransactionsStatusModal";

type ExportTransactionsFormProps = {
    className?: string;
}

const ExportTransactionsFormContainer: FC<ExportTransactionsFormProps> = (props) => {
    const exportTransactionsUseCase = container.get<ExportTransactionsUseCase>(UseCaseTypes.ExportTransactionsUseCase);
    const { download } = useDownload();
    const { openModal } = useModal(EXPORT_TRANSACTIONS_STATUS_MODAL_ID);

    const handleExportTransactions = async (values: ExportTransactionsFormValues) => {
        if(!values.startDate || !values.endDate) return;
        const data = await exportTransactionsUseCase.exportTransactions(values.startDate, values.endDate);
        if(data){
            download(data);
            alert("report-ready")
        }else{
            alert("report-sent")
        }
    }

    const alert: ExportTransactionsAlertHandler = (type) =>{
        openModal(
            ExportTransactionsStatusModal,
            exportTransactionsModalContent[type],
            EXPORT_TRANSACTIONS_STATUS_MODAL_ID
        )
    }

    return <ExportTransactionsForm onExportTransactions={handleExportTransactions} alert={alert} {...props}/>
};

export default ExportTransactionsFormContainer;
