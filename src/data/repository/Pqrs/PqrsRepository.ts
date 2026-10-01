import AlgoliaClient from "@/data/provider/algolia/algoliaClient";
import { AlgoliaIndex } from "@/data/provider/algolia/types";

import { IPQRSSRepository } from "@/domain/repository/Pqrs/IPqrsRepository";
import { injectable } from "inversify";
import RepositoryBase from "../RepositoryBase";
import { FaqFrequentQuestion } from "@/domain/entity/Pqrs/pqrs";

const HOME_FAQS: FaqFrequentQuestion[] = [
    {
        id: '1',
        faqCategoryId: 'home',
        title: '¿Cuál es el tiempo de entrega de los productos?',
        description: 'Los productos del catálogo Pichincha Miles se entregan en un plazo máximo de 7 días hábiles a partir de la fecha de canje.\n\nSi tienes alguna duda adicional, comunícate al 1800 PBMILE (276453).',
    },
    {
        id: '2',
        faqCategoryId: 'home',
        title: '¿Los productos tienen garantía?',
        description: 'Si, los productos tienen la garantía del proveedor que los suministra.',
    },
    {
        id: '3',
        faqCategoryId: 'home',
        title: '¿Existe un límite para hacer uso de las millas?',
        description: 'No existe un límite para utilizar tus millas en el programa de recompensas.',
    },
    {
        id: '4',
        faqCategoryId: 'home',
        title: '¿Cuánto tiempo tardan en acreditarse en mi cuenta las millas generadas?',
        description: 'Las millas generadas se acreditarán en tu cuenta Pichincha Miles en aproximadamente 45 días a partir de la fecha en que se realizó el consumo y una vez que hayas efectuado el pago puntual de tu tarjeta de crédito.\n\nSi tienes dudas adicionales, comunícate al 1800 al PBMILE (276453)',
    },
    {
        id: '5',
        faqCategoryId: 'home',
        title: '¿Cómo acumulo millas en el Programa Pichincha Miles?',
        description: 'Acumulas millas cada vez que realizas compras con tus tarjetas de crédito Pichincha Miles Mastercard o Pichincha Miles Visa.\n\nLas millas se registran en tu cuenta Pichincha Miles y podrás usarlas para canjear viajes, productos, experiencias y otras opciones disponibles en el catálogo.',
    },
    {
        id: '6',
        faqCategoryId: 'home',
        title: '¿Qué tipo de canjes se pueden realizar con las millas de Pichincha Miles?',
        description: 'Puedes realizar el canje de tus millas Pichincha Miles por pasajes aéreos en más de 250 aerolíneas, alojamiento en más de 175.000 hoteles alrededor del mundo, actividades turísticas nacionales e internacionales, alquiler de automóviles, tickets Disney y mucho más. No existe un valor mínimo requerido para el uso de tus millas.\n\nSi tienes alguna duda adicional, comunícate al 1800 PBMILE (276453).',
    },
];

@injectable()
export default class PQRSSRepository
    extends RepositoryBase
    implements IPQRSSRepository
{
    private readonly algoliaClient = new AlgoliaClient(AlgoliaIndex.PQRS);

    async getFaqCategories() {
        const response = await this.algoliaClient.search({
            params: {
                programId: this.programId,
                type: "faqcategory",
                page: 1,
                pageSize: 100,
            },
            adapter: (hit) => ({
                id: hit.id as string,
                name: hit.name as string,
            }),
        });

        return response.list.data;
    }


    async getFrequentQuestions() {
        const response = await this.algoliaClient.search({
            params: {
                programId: this.programId,
                type: "faq",
                page: 1,
                pageSize: 100,
            },
            adapter: (hit) => ({
                id: hit.id as string,
                title: hit.title as string,
                faqCategoryId: hit.faqCategoryId as string,
                description: hit.description as string,
            }),
        });

        return response.list.data;
    }

    getHomeFaqs() {
        return HOME_FAQS;
    }
}
