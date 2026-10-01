import React from 'react';
import List from '@/presentation/components/List';
import { otherBenefits } from '../data/otherBenefits';

const OtherBenefitsSection: React.FC = () => (
    <div className="mb-4 [&>p]:base-paragraph [&>p]:font-medium [&>p]:leading-body-dropdown [&>p]:text-dropdown">
        <p>
            Pichincha Miles podrá ofrecer alternativas adicionales para acumular 
            y/o redimir sus Millas:
        </p>
        <List items={otherBenefits} type="ol" className="pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" />
        <p>
            Dichas campañas, incentivos u ofertas serán comunicadas oportunamente 
            y se regirán por los términos y condiciones que sean publicados con 
            las mismas.
        </p>
    </div>
);

export default OtherBenefitsSection;
