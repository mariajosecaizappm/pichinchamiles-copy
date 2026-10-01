
import { ReactElement } from "react";
import LegalConditionsLayout from "@/presentation/components/Layout/LegalConditionsLayout";

const PrivacyPolicies = (): ReactElement => {
    return (
        <LegalConditionsLayout containerClassName="[&>p]:base-paragraph [&>p]:font-normal" title="Políticas de privacidad en Internet">
            <p>
                Bienvenido al sitio WEB de <strong>Pichincha Miles</strong>. En esta
                sección se explica la política de nuestra página referente a la
                información que Usted pueda proveernos cuando visite nuestro sitio.
            </p>
            <p>
                Estamos comprometidos en proteger su información en Internet, en
                todos los canales en los que interactuamos con Usted, por lo que
                hemos incorporado las más altas medidas de seguridad en nuestra Web,
                entre ellas: codificación de datos, cierre automático de sesión y
                bloqueo automático de acceso no autorizado por medio de
                &quot;firewalls&quot;.
            </p>
            <p>
                Al visitar nuestro sitio web Usted puede encontrar información
                actualizada del programa de recompensas Pichincha Miles® sin
                necesidad de que nos proporcione información acerca de Usted.
            </p>
            <p>
                La información que ingresa en nuestra página se mantiene bajo
                estándares de seguridad y de estricta confidencialidad. Le
                garantizamos la codificación de los datos antes de su transferencia
                para proveer la mayor seguridad posible.
            </p>
            <p>
                De proporcionarnos información adicional como su dirección, correo
                electrónico y teléfono, así como cualquier otra información
                complementaria y datos que le identifiquen como miembro de Pichincha
                Miles®, esta no será revelada a terceros a menos de que se lo
                hayamos comunicado previamente, que hubiéremos sido autorizados por
                Usted, o que estemos requeridos a hacerlo por Ley.
            </p>
            <p>
                Nos asociamos con Microsoft Clarity y Microsoft Advertising para captar cómo utilizas e
                interactúas con nuestro sitio web/app mediante métricas de comportamiento, mapas de
                calor y reproducción de sesiones, con el fin de mejorar y promocionar nuestros
                productos/servicios. Los datos de uso del sitio se capturan utilizando cookies propias y
                de terceros, así como otras tecnologías de seguimiento, para determinar la popularidad
                de los productos/servicios y la actividad en línea. Además, utilizamos esta información
                para la optimización del sitio, fines de fraude/seguridad y publicidad. Para obtener más
                información sobre cómo Microsoft recopila y utiliza tus datos, visita la Declaración de
                Privacidad de Microsoft <a href='https://privacy.microsoft.com/es-es/privacystatement' target='_blank'>aquí</a>.
            </p> 
        </LegalConditionsLayout>
    );
};

export default PrivacyPolicies;
