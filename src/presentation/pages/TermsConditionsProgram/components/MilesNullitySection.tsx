import React from 'react';
import List from '@/presentation/components/List';
import { milesNullities } from '../data/milesNullities';

const MilesNullitySection: React.FC = () => {
    return (
        <div className="mb-4 [&>p]:base-paragraph [&>p]:font-medium [&>p]:leading-body-dropdown [&>p]:text-dropdown">
            <p>
                A partir del 1 de enero de 2024, todas las Millas acumuladas por consumos con Tarjeta de Crédito 
                dentro del Programa Pichincha Miles®, estarán sujetas a las condiciones de nulidad que Banco Pichincha 
                determine, y tendrá la potestad de establecerlas de forma diferencial según el producto o segmentación 
                conforme con las políticas del Banco.
            </p>
            <p>
                Todas las millas que hayan sido generadas con tarjetas de crédito emitidas antes de la fecha mencionada 
                no tendrán alteración.
            </p>
            <p>
                En el momento de la redención de Millas, se debitarán de la cuenta del Cliente, aquellas que tienen mayor 
                antigüedad, permitiendo así que las Millas que queden disponibles sean las de más reciente acumulación.
            </p>
            <p>
                En caso de perderlas por su no utilización dentro del término de vigencia de estas, no podrán ser 
                reintegrados en la cuenta del Cliente por ningún motivo.
            </p>
            <p>
                Las millas acumuladas que no hayan sido utilizadas, serán anuladas cuándo:
            </p>
            <List items={milesNullities} type="ol" className="pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown mb-4" />
        </div>
    );
};

export default MilesNullitySection;
