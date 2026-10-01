'use client';

import React from 'react';
import LegalConditionsLayout from '@/presentation/components/Layout/LegalConditionsLayout';
import Tabs from '@/presentation/components/Tabs/Tabs';
import { getTabbedContent } from './data';

const TermsConditionsUse = () => {
    const tabItems = getTabbedContent();

    return (
        <LegalConditionsLayout title="Términos y Condiciones de Uso"
            containerClassName=" [&>p]:base-paragraph [&>p]:font-normal [&>p]:leading-body-dropdown"
        >
            <p>
                Lea cuidadosamente los presentes términos y condiciones de acceso.
                Al acceder a este sitio y a cualquier página del mismo, se
                compromete a cumplir con los términos y condiciones que se detallan
                a continuación.
            </p>
            <p>
                En caso de no estar de acuerdo con los siguientes términos y condiciones no acceda a este sitio o a cualquier página del mismo.
            </p>
            <div>
                <Tabs items={tabItems} fullWidth />
            </div>
            <p className='text-center'>¡RECUERDE! SU INFORMACIÓN ES PERSONAL Y ESTRICTAMENTE CONFIDENCIAL.</p>
        </LegalConditionsLayout>
    );
};

export default TermsConditionsUse;
