import { TermsConditionsUseItem } from './';
import { TabItem } from '@/presentation/components/Tabs/Tabs';
import Accordion, { AccordionItem } from '@/presentation/components/Accordion';
import React from 'react';

export const termsConditionsData = {
    "Propiedad y uso": [
        {
            id: '0',
            title: 'COPYRIGHT © Pichincha Miles 2012',
            data: '<p>Los derechos de propiedad intelectual de estas páginas y de las pantallas que se muestran en las mismas, así como de la información y material como fotografías, logos, imágenes, etc. que aparecen en ellas, pertenecen a Pichincha Miles® salvo que se indique lo contrario.</p>',
            hasHtml: true,
        },
        {
            id: '1',
            title: 'Marcas Registradas',
            data: '<p>Banco Pichincha y Pichincha Miles® son marcas registradas por lo que se encuentran protegidas por las normas de Propiedad Intelectual. El Logo de Pichincha Miles® es marca registrada y marca identificadora del programa de recompensas Pichincha Miles.</p>',
            hasHtml: true,
        },
        {
            id: '2',
            title: 'Uso de Información y Materiales',
            data: '<p>La información, materiales, condiciones y descripciones que figuran en estas páginas, están sujetas a cambio. No todos los productos y servicios se encuentran disponibles en todas las áreas geográficas y requieren que el cliente cumpla con los requisitos para poder adquirirlos. La selección de ciertos productos y servicios está sujeta a la determinación y aceptación final de Pichincha Miles®.</p>',
            hasHtml: true,
        },
        {
            id: '3',
            title: 'Sin Garantía',
            data: '<p>La información y los materiales de los bienes o servicios que figuran en el presente sitio, se suministran "como se encuentran", "como están disponibles". Pichincha Miles® no otorga garantía alguna sobre ninguno de los bienes o servicios que se ofrecen en el presente sitio.</p>',
            hasHtml: true,
        },

    ],
    "Responsabilidad y tecnología": [
        {
            id: '4',
            title: 'Límite de Responsabilidad',
            data: '<p class="mb-4">En ningún caso Pichincha Miles® será responsable de algún daño, incluyendo, sin límite, daños, pérdidas o gastos directos, indirectos, inherentes o consecuentes, que surjan en relación con este sitio o su uso o imposibilidad de uso por alguna de las partes, o en relación con cualquier falla en el rendimiento, error, omisión, interrupción, defecto, demora en la operación o transmisión, virus de computadora o falla de sistema o línea, aún en el caso de que Pichincha Miles®, o sus representantes fueran informados sobre la posibilidad de dichos daños, pérdidas o gastos. </p> <p class="mb-4">Las hiperconexiones con otros medios de la internet se realizan bajo su propio riesgo; Pichincha Miles® no investiga, verifica, controla ni respalda el contenido, la exactitud, las opiniones expresadas y otras conexiones suministrados por estos medios. </p><p class="mb-4"> Asimismo, Pichincha Miles® no será responsable cuando se evidencie que los débitos de Millas en la cuenta del socio titular se deban a fallas por parte del mismo en la administración de su usuario y/o contraseña de acceso al sistema o que se haya vulnerado medios de accesos propios de los usuarios y/o contraseñas, tal como el correo electrónico, sea por tácticas de phishing, malware u otros similares y que hayan permitido el acceso y la ejecución de transacciones no autorizadas por los Socios, en este sentido, Pichincha Miles® no será responsable sobre dichos débitos de Millas, por lo tanto no se realizará devoluciones de Millas a los Socios que hayan sido víctimas de lo mencionado anteriormente.</p>',
            hasHtml: true,
        },
        {
            id: '5',
            title: 'Presentaciones',
            data: '<p>La totalidad de la información que presenta Pichincha Miles® a través de este sitio será considerada y permanecerá siendo propiedad de Pichincha Miles®. Así mismo, Pichincha Miles® podrá utilizar, con cualquier fin, toda idea, concepto, conocimiento o técnica incluida en la información que proporcione un visitante a través de este sitio. Pichincha Miles® no estará sujeto a obligación alguna en cuanto a la confidencialidad con respecto a la información presentada, excepto si así fuera acordado por la entidad que mantiene una relación directa con el Cliente o se acuerde de otro modo o así se requiera por ley.</p>',
            hasHtml: true,
        },
        {
            id: '6',
            title: 'Microsoft Clarity',
            data: `<p>Mejoramos nuestros productos y publicidad utilizando Microsoft Clarity para ver cómo usas nuestro sitio web/aplicación. Al usar nuestro sitio/app, aceptas que nosotros y Microsoft podemos recopilar y usar estos datos. Puedes encontrar <a href='https://privacy.microsoft.com/es-es/privacystatement' target='_blank'>aquí</a> nuestra declaración de privacidad que contiene más detalles.</p>`,
            hasHtml: true,
        },
    ]
};

const createAccordionItems = (items: TermsConditionsUseItem[]): AccordionItem[] => {
    return items.map((item: TermsConditionsUseItem, index: number) => ({
        id: index.toString(),
        title: item.title,
        content: item.data,
        hasHtml: item.hasHtml || false
    }));
};

export const getTabbedContent = (): TabItem[] => {
    return [
        {
            id: 'propiedad-y-uso',
            label: 'Propiedad y uso',
            content: (
                <Accordion
                    disablePadding={true}
                    itemClassName='*:base-paragraph *:font-medium *:leading-body-dropdown *:text-dropdown mb-4'
                    items={createAccordionItems(termsConditionsData["Propiedad y uso"])} />
            )
        },
        {
            id: 'responsabilidad-y-tecnologia',
            label: 'Responsabilidad y tecnología',
            content: (
                <Accordion
                    disablePadding={true}
                    itemClassName='*:base-paragraph *:font-medium *:leading-body-dropdown *:text-dropdown mb-4'
                    items={createAccordionItems(termsConditionsData["Responsabilidad y tecnología"])} />
            )
        }
    ];
};
