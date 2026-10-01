import React from 'react';
import RegisterSection from './components/RegisterSection';
import ValiditySection from './components/ValiditySection';
import MilesAccumulationSection from './components/MilesAccumulationSection';
import MilesRedemptionSection from './components/MilesRedemptionSection';
import MilesTransferSection from './components/MilesTransferSection';
import MilesNullitySection from './components/MilesNullitySection';
import OtherBenefitsSection from './components/OtherBenefitsSection';
import ProgramChangesSection from './components/ProgramChangesSection';
import LegislationSection from './components/LegislationSection';
import OtherObligationsSection from './components/OtherObligationsSection';
import IrrevocableMandateSection from './components/IrrevocableMandateSection';
import TravelsRedemptionSection from './components/TravelsRedemptionSection';
import TravelsCopagoRedemptionSection from './components/TravelsCopagoRedemptionSection';
import FlightsRedemptionSection from './components/FlightsRedemptionSection';
import HotelsRedemptionSection from './components/HotelsRedemptionSection';
import CarRedemptionSection from './components/CarRedemptionSection';
import ActivitiesRedemptionSection from './components/ActivitiesRedemptionSection';
import ProductsRedemptionSection from './components/ProductsRedemptionSection';
import PaymentButtonSection from './components/PaymentButtonSection';
import DiscountsSection from './components/DiscountsSection';
import AdditionalTermsSection from './components/AdditionalTermsSection';
import PqrTermsSection from './components/PqrTermsSection';
import { TabItem } from '@/presentation/components/Tabs/Tabs';
import Accordion from '@/presentation/components/Accordion/Accordion';

export const termsConditionsProgramContent = {
    "Membresía y millas": [
        {
            id: '0',
            title: 'Registro',
            content: <RegisterSection />,
        },
        {
            id: '1',
            title: 'Vigencia de la membresía',
            content: <ValiditySection />,
        },
        {
            id: '2',
            title: 'Acumulación de Millas',
            content: <MilesAccumulationSection />,
        },
        {
            id: '3',
            title: 'Redención de Millas',
            content: <MilesRedemptionSection />,
        },
        {
            id: '4',
            title: 'Transferencia de Millas',
            content: <MilesTransferSection />,
        },
        {
            id: '5',
            title: 'Nulidad de Millas acumuladas',
            content: <MilesNullitySection />
        },
    ],
    "Condiciones de canje": [
        {
            id: '11',
            title: 'Condiciones e información general redención de viajes',
            content: <TravelsRedemptionSection />,
        },
        {
            id: '12',
            title: 'Condiciones e información general de redención de viajes con millas más dinero (copago)',
            content: <TravelsCopagoRedemptionSection />,
        },
        {
            id: '13',
            title: 'Condiciones e información general redención de tiquetes o boletos aéreos',
            content: <FlightsRedemptionSection />,
        },
        {
            id: '14',
            title: 'Condiciones e información general redención de hoteles',
            content: <HotelsRedemptionSection />,
        },
        {
            id: '15',
            title: 'Condiciones e información general redención de renta de auto',
            content: <CarRedemptionSection />,
        },
        {
            id: '16',
            title: 'Condiciones e información general redención de actividades',
            content: <ActivitiesRedemptionSection />,
        },
        {
            id: '17',
            title: 'Condiciones e información general redención de productos',
            content: <ProductsRedemptionSection />,
        },
        {
            id: '18',
            title: 'Botón de pagos',
            content: <PaymentButtonSection />,
        },
    ],
    "Programa y legal": [
        {
            id: '6',
            title: 'Otros beneficios',
            content: <OtherBenefitsSection />
        },
        {
            id: '7',
            title: 'Cancelación, modificación o terminación del programa Pichincha Miles',
            content: <ProgramChangesSection />,
        },
        {
            id: '8',
            title: 'Legislación y Jurisdicción',
            content: <LegislationSection />,
        },
        {
            id: '9',
            title: 'Otras obligaciones',
            content: <OtherObligationsSection />,
        },
        {
            id: '10',
            title: 'Mandato irrevocable',
            content: <IrrevocableMandateSection />
        },
        {
            id: '19',
            title: 'Descuentos promocionales',
            content: <DiscountsSection />,
        },
        {
            id: '20',
            title: 'Otros Términos',
            content: <AdditionalTermsSection />,
        },
        {
            id: '21',
            title: 'Peticiones, quejas y reclamos',
            content: <PqrTermsSection />,
        },
    ]
};

const createAccordionContent = (sectionKey: keyof typeof termsConditionsProgramContent) => (
    <Accordion 
        disablePadding={true}
        items={termsConditionsProgramContent[sectionKey].map((item) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            hasHtml: false
        }))}
    />
);

export const getTabbedContent = (): TabItem[] => {
    return [
        {
            id: 'membership',
            label: 'Membresía y millas',
            content: createAccordionContent("Membresía y millas")
        },
        {
            id: 'redemption',
            label: 'Condiciones de canje',
            content: createAccordionContent("Condiciones de canje")
        },
        {
            id: 'program',
            label: 'Programa y legal',
            content: createAccordionContent("Programa y legal")
        }
    ];
};
