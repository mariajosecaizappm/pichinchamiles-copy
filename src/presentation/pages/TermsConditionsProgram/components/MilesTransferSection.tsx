import React from 'react';

const MilesTransferSection: React.FC = () => (
    <div className="mb-4 [&>p]:base-paragraph [&>p]:font-medium [&>p]:leading-body-dropdown [&>p]:text-dropdown">
        <p>
            Para transferir Millas de una cuenta Pichincha Miles a otra cuenta 
            Pichincha Miles, ambos usuarios deben estar activos en el programa. 
            El monto mínimo de transferencia es de diez (10) millas y el monto 
            máximo es el saldo disponible en Millas del usuario que realiza la 
            transferencia.
        </p>
        <p>
            Una vez que se haya realizado la transferencia, no es posible 
            devolver las millas.
        </p>
    </div>
);

export default MilesTransferSection;
