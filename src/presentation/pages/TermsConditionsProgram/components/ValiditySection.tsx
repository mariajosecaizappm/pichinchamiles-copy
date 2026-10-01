import React from 'react';
import List from '@/presentation/components/List';
import { validityData } from '../data/validityData';

const ValiditySection: React.FC = () => (
    <div className="mb-4 [&>p]:base-paragraph [&>p]:font-medium [&>p]:leading-body-dropdown [&>p]:text-dropdown">
        <p>
            El plazo de vigencia de la membresía es de un año, contado a partir de la fecha de registro en el Programa Pichincha Miles. Este plazo será renovado de manera automática, sin necesidad de ningún tipo de notificación, siempre y cuando el cliente cumpla con lo estipulado en los términos y condiciones del Programa.
        </p>
        <p>
            Una cuenta Pichincha Miles podrá ser cerrada o cancelada bajo las siguientes condiciones:
        </p>
        <List items={validityData} type="ol" className="pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" />
        <p>
            En los casos indicados las millas acumuladas por cada usuario 
            podrán ser utilizadas o transferidas a otra cuenta Pichincha Miles, 
            hasta 180 días posteriores al cierre de la cuenta.
        </p>
    </div>
);

export default ValiditySection;
