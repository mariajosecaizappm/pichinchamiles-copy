import React, {FC, useState} from 'react';
import {useRouter} from "next/navigation";
import links from "@/presentation/config/links";
import FeeCheckbox from "./FeeCheckbox";
import Link from "next/link";
import {Button} from "@/presentation/components/Form/components/Button";

type FeePaymentFormProps = {
    reference: string
    placeToPayUrl: string
}

const FeePaymentForm: FC<FeePaymentFormProps> = ({reference, placeToPayUrl}) => {
    const router = useRouter();
    const [acceptedTermsAndConditions, setAcceptedTermsAndConditions] = useState(false);
    const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
    const [hasError, setHasError] = useState(false);
    const handlePayFee = () => {
        setHasError(false);
        if(!acceptedPrivacyPolicy || !acceptedTermsAndConditions){
            setHasError(true);
            return;
        }

        // @ts-expect-error - Place to Pay SDK se carga dinámicamente
        window['P'].init(placeToPayUrl,
            // @ts-expect-error - Place to Pay SDK se carga dinámicamente
            window['P'].on('response', () => {
                router.push(`${links.feePay}?reference=${reference}`);
            })
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <FeeCheckbox
                name="acceptedTermsAndConditions"
                label={<>Si, acepto los <Link className="underline text-information-500 text-sm leading-[20px] font-normal" href={links.termsAndConditions} target="_blank">términos y condiciones</Link></>}
                checked={acceptedTermsAndConditions}
                onChange={setAcceptedTermsAndConditions}
                hasError={hasError && !acceptedTermsAndConditions}
            />
            <FeeCheckbox
                name="acceptedPrivacyPolicy"
                label={<>Si, acepto las <Link target="_blank" rel="noopener nonreferrer" className="underline text-information-500 text-sm leading-[20px] font-normal" href={links.lopdDocument}>políticas de protección de datos</Link></>}
                checked={acceptedPrivacyPolicy}
                onChange={setAcceptedPrivacyPolicy}
                hasError={hasError && !acceptedPrivacyPolicy}
            />
            <Button
                color="primary"
                type="button"
                onPress={handlePayFee}
                disabled={!placeToPayUrl}
            >
                Pagar fee y completar canje
            </Button>
        </div>
    );
};

export default FeePaymentForm;
