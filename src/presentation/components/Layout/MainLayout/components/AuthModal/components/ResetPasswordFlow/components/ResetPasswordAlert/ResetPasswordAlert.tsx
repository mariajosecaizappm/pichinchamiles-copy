import React from 'react';
import useSession from "@/presentation/hooks/useSession";
import {Button} from "@/presentation/components/Form/components/Button";
import Icon from "@/presentation/components/icons/Icon";

const ResetPasswordAlert = () => {
    const { onCloseAuthModal } = useSession();

    return (
        <div className="flex-1 flex flex-col gap-1" aria-labelledby='reset-password-alert-title' aria-describedby='reset-password-alert-description'>
            <Icon name="icon-success" className="mx-auto mb-3" width={64} height={64} aria-hidden="true"/>
            <h6 id='reset-password-alert-title' className="text-center typo-main-headline-3-prelo-semi-bold text-blue-500">Actualizacion exitosa</h6>
            <div id='reset-password-alert-description' className="text-center typo-main-caption-book text-grayScale-500">
                <p>Tu nueva contraseña se a guardado correctamente.</p>
                <p>Ya puedes ingresar a tu perfil y disfrutar los beneficios y promociones de <strong>Pichincha Miles.</strong></p>
            </div>
            <Button
                testId="acceptButton"
                type="button"
                onPress={onCloseAuthModal}
                className="mt-auto md:mt-10"
                color="primary"
                aria-label="Entendido. Finalizar proceso"
            >
                Entendido
            </Button>
        </div>
    );
};

export default ResetPasswordAlert;