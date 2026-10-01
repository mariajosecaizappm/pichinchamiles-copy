import React from 'react';
import List from '@/presentation/components/List';
import { registersData } from '../data/registersData';

const RegisterSection: React.FC = () => (
    <div className="mb-4 mr-6 [&>p]:base-paragraph [&>p]:font-medium [&>p]:leading-body-dropdown [&>p]:text-dropdown">
        <p>
            El registro en el programa aplica para Clientes con Tarjeta de 
            Crédito Pichincha Miles activa del Banco Pichincha.
        </p>
        <p>
            Con el registro en el programa el Cliente declara que conoce 
            y acepta los siguientes términos y condiciones, así mismo tendrá 
            derecho a los beneficios de Pichincha Miles con base en los 
            convenios que para el efecto suscriba el Programa en calidad 
            de administrador, con las sociedades o individuos que forman parte 
            del Programa de recompensas.
        </p>
        <p>
            El canal habilitado para el registro o activación en el programa es 
            la página web www.pichinchamiles.com. La cuenta creada por cada 
            Cliente es personal e intransferible.
        </p>
        <p>
            Cuando el cliente sea acreedor de algún tipo de premio o beneficio 
            otorgado por el Pichincha Miles con motivo de alguna campaña 
            promocional, autoriza al programa para publicar su nombre y el 
            beneficio recibido en cualquier medio publicitario, sin lugar a 
            ningún tipo de compensación y sin que sea necesario requerir de 
            alguna autorización adicional.
        </p>
        <p>
            El cliente que se registre en el Programa se compromete a:
        </p>
        <List items={registersData} type="ol" className='pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown' />
    </div>
);

export default RegisterSection;
