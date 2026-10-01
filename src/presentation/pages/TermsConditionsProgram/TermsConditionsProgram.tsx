'use client';

import React from 'react';
import LegalConditionsLayout from '@/presentation/components/Layout/LegalConditionsLayout';
import Tabs from '@/presentation/components/Tabs/Tabs';
import LopdForm from '@/presentation/components/Layout/MainLayout/components/LopdModal/components/LopdForm';
import { needsTermsConsent } from '@/presentation/components/Layout/MainLayout/components/LopdModal/lopdConsentHelpers';
import useSession from '@/presentation/hooks/useSession';
import { getTabbedContent } from './content';

const TermsConditionsProgram = () => {
    const tabItems = getTabbedContent();
    const { member, consent, isLogged, cif } = useSession();
    const showInlineConsentForm = Boolean(
        isLogged
        && member
        && needsTermsConsent(member)
    );

    return (
        <LegalConditionsLayout containerClassName='[&>p]:base-paragraph [&>p]:font-normal [&>p]:leading-body-dropdown'  title="Términos y Condiciones del Programa">
            <p>
                Pichincha Miles® es el programa de lealtad del Banco Pichincha en Ecuador para sus clientes, en donde se 
                otorga la acumulación de Millas por consumo y que posteriormente se pueden canjear por productos 
                y servicios, los cuales están disponibles en www.pichinchamiles.com.ec
            </p>
            <p>
                Estos términos y condiciones modifican y sustituyen cualquier versión anterior de los términos
                y condiciones del programa Pichincha Miles (en adelante el &quot;Programa&quot;); también delimitan 
                y aclaran las condiciones bajo las cuales los Clientes pueden registrarse, participar y retirarse 
                del programa Pichincha Miles, así mismo las obligaciones del Programa con sus usuarios. Estos términos 
                y condiciones pueden ser modificados, enmendados y/o sustituidos en cualquier momento, con previo aviso, 
                así como también las demás regulaciones, ofertas especiales y beneficios del Programa Pichincha Miles®, 
                por el Banco Pichincha.
            </p>
            {showInlineConsentForm && member && (
                <div className="my-6">
                    <LopdForm
                        member={member}
                        consent={consent}
                        cif={cif}
                        variant="page"
                        onClose={() => undefined}
                    />
                </div>
            )}
            <div>
                <Tabs items={tabItems} fullWidth/>
            </div>
        </LegalConditionsLayout>
    );
};

export default TermsConditionsProgram;
