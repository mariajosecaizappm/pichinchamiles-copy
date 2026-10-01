import { ReactElement } from "react";
import { securityAlerts } from './data';
import LegalConditionsLayout from "@/presentation/components/Layout/LegalConditionsLayout";
import List from "@/presentation/components/List";

const SecurityAlerts = (): ReactElement => {
    return (
        <LegalConditionsLayout containerClassName="[&>p]:base-paragraph [&>p]:font-normal" title="Alertas de Seguridad en Internet">
            <p>
                En la actualidad existen en internet sofisticados métodos
                fraudulentos tales como virus electrónicos, entre otros, diseñados
                para capturar información confidencial de los usuarios de sitios
                web.
            </p>
            <p>
                Para evitar que Usted se convierta en víctima de terceros que tienen
                como objetivo obtener su información personal, le recomendamos tomar
                en cuenta lo siguiente:
            </p>
            <List items={securityAlerts} itemClassName="base-paragraph font-normal" />
        </LegalConditionsLayout>
    );
};

export default SecurityAlerts;
