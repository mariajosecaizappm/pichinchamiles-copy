import React, {FC} from 'react';
import {Member} from "@/domain/entity/Member/member";
import ActivationSummaryItem
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary/components/ActivationSummaryItem";
import getMemberSummary
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary/getMemberSummary";
import AddressAccordion
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary/components/AddressAccordion";
import {Button} from "@/presentation/components/Form/components/Button";
import useSession from "@/presentation/hooks/useSession";

type ActivationSummaryProps = {
    member: Member
}

const ActivationSummary: FC<ActivationSummaryProps> = ({member}) => {
    const { onCloseAuthModal } = useSession();

    return (
        <div className="flex-1">
            <p className="typo-main-caption-book text-neutral-800 mb-4">Tus datos registrados son:</p>
            <dl className="flex flex-col gap-1 mb-4">
                {getMemberSummary(member).map(item=>(
                    <ActivationSummaryItem
                        key={item.label}
                        label={item.label}
                        value={item.value}
                    />
                ))}
            </dl>
            <AddressAccordion member={member}/>
            <Button
                type="button"
                color="primary"
                onPress={onCloseAuthModal}
                className="mt-6"
                data-testid="cotinueActivation"
                aria-label="Finalizar, completa tu registro en Pichincha Miles"
            >
                Continuar
            </Button>
        </div>
    );
};

export default ActivationSummary;