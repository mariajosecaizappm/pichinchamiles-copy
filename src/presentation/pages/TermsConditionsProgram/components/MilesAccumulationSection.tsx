import React from 'react';
import List from '@/presentation/components/List';
import Link from 'next/link';
import { 
    milesAccumulationForPerson, 
    milesAccumulationForCompany, 
    milesAccumulationForPymes, 
    milesAccumulationForMicrocompany 
} from '../data/milesAccumulationData';

const MilesAccumulationSection: React.FC = () => (
    <div className="mb-4 *:base-paragraph *:font-medium *:leading-body-dropdown *:text-dropdown">
        <p>
            Los Clientes acumulan millas por los consumos realizados con las 
            Tarjetas de Crédito Miles del Banco Pichincha en Ecuador y 
            alrededor del mundo, en función a las condiciones establecidas por 
            Pichincha Miles®
        </p>
        <p>
            Pichincha Miles® acreditará las millas acumuladas a cada cliente 
            en su cuenta individual del programa, en el tiempo establecido para 
            ello. El correspondiente estado de cuenta estará a disposición del 
            cliente para consulta en www.pichinchamiles.com
        </p>
        <p>
            Los Clientes podrán tener saldos de Millas negativos en su cuenta 
            individual por: a. cuando la transacción de acumulación sea reversada 
            y el Cliente no posee un saldo de Millas igual o superior al valor 
            de la reversión. b) Cuando Pichincha Miles® realice un ajuste débito 
            de Millas y el Cliente no posea un saldo suficiente para cubrirlo; 
            b. Cuando se genere un error en el sistema, evento que una vez 
            conocido por Pichincha Miles®, deberá ser solucionado entregando 
            al Cliente las Millas que le correspondan.
        </p>
        <p>
            No se acumularán Millas en las cuentas que se encuentren cerradas o 
            bloqueadas con la restricción para ganar Millas.
        </p>
        <div>
            <div>
                <p className="font-bold font-slab">Para Personas:</p>
                <p>Productos con los que se acumula Pichincha Miles:</p>
                <List items={milesAccumulationForPerson} className="pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" />
                <p>
                    Para consultar las categorías en las que no aplica la acumulación de millas 
                    <Link 
                        href="https://www.pichincha.com/sites/default/files/excepciones_en_planes_de_recompensas.pdf" 
                        target="_blank" 
                        className="underline"
                    >
                        aquí
                    </Link>. 
                    Para consultar la cantidad de Millas acumuladas por consumo 
                    <Link 
                        href="https://assets.miles.com.ec/2026/Pichincha_Miles_millas_por_consumo_por_tarjetas.pdf" 
                        target="_blank" 
                        className="underline"
                    >
                        aquí
                    </Link>
                </p>
            </div>
      
            <div>
                <h5 className="font-bold font-slab">Para Empresas:</h5>
                <p>Productos con los que se acumula Pichincha Miles:</p>
                <List items={milesAccumulationForCompany} className="pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" />
            </div>
      
            <div>
                <h5 className="font-bold font-slab">PYMES (Persona Natural y Jurídica):</h5>
                <p>Productos con los que se acumula Pichincha Miles:</p>
                <List items={milesAccumulationForPymes} className="pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" />
            </div>
      
            <div>
                <div>
                    <p className="font-bold font-slab">Microempresas:</p>
                    <p>Productos con los que se acumula Pichincha Miles:</p>
                    <List items={milesAccumulationForMicrocompany} className="pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" />
                    <p>
                        Para consultar las categorías en las que no aplica la acumulación de millas 
                        <Link 
                            href="https://www.pichincha.com/sites/default/files/excepciones_en_planes_de_recompensas.pdf" 
                            target="_blank" 
                            className="underline"
                        >
                            aquí
                        </Link>. 
                        Para consultar la cantidad de Millas acumuladas por consumo 
                        <Link 
                            href="https://assets.miles.com.ec/2026/Pichincha_Miles_millas_por_consumo_por_tarjetas.pdf" 
                            target="_blank" 
                            className="underline"
                        >
                            aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default MilesAccumulationSection;
