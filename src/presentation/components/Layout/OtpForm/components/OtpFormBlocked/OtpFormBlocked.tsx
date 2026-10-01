import React, {FC} from 'react';
import Countdown from "@/presentation/components/Layout/OtpForm/components/Countdown";
import Icon from "@/presentation/components/icons/Icon";
import {Button} from "@/presentation/components/Form/components/Button";

type OtpFormBlockedProps = {
    blockedUntil: Date
    onUnblock: () => void
    onContinueBlockUser?: () => void
}

const OtpFormBlocked: FC<OtpFormBlockedProps> = ({blockedUntil, onUnblock, onContinueBlockUser}) => {
    return (
        <div className="flex-1 flex flex-col">
            <Icon name="icon-error" className="mx-auto mb-4" width={64} height={64} aria-hidden="true"/>
            <h6 className="typo-main-headline-3-prelo-semi-bold text-blue-500 text-center">
                ¡Has superado el límite de intentos fallidos!
            </h6>
            <p
                className="typo-main-caption-book text-grayscale-500 text-center mt-1"
                aria-label="Por motivos de seguridad, hemos bloqueado temporalmente el proceso de vinculación. Puedes volver a intentarlo en el tiempo restante."
            >
                Por motivos de seguridad, hemos bloqueado temporalmente el proceso de vinculación. Puedes volver a intentarlo en [<Countdown
                    onComplete={onUnblock}
                    key={blockedUntil.toISOString()}
                    date={blockedUntil}
                />].
            </p>
            <Button
                color="primary"
                type="button"
                onPress={onContinueBlockUser}
                className="mt-auto md:mt-4"
                testId="continueOtp"
                aria-label="Entendido"
            >
                Entendido
            </Button>
        </div>
    );
};

export default OtpFormBlocked;