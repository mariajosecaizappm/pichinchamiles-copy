import { EmbeddedListItem } from '@/presentation/components/EmbeddedList';

const conditionsFlightCredit = [
    "La nueva reserva se realiza a nombre del mismo pasajero que figuraba en la reservación garantizada cancelada.",
    "La nueva reserva se realiza en la misma aerolínea de la reservación original.",
    "Todos los viajes asociados con la nueva reserva deben completarse antes de la fecha especificada por la aerolínea, misma que se determina en las normas sobre tarifas del boleto original y en la clase de servicio original.",
    "El cliente es responsable de pagar las tarifas de cambio cobradas por la aerolínea relacionadas con la nueva reserva, además de los cargos adicionales, tarifas o aumentos de la tarifa.",
    "El crédito no puede aplicarse en una reserva existente.",
    "Si el proveedor no emite un reembolso o un crédito, la reserva cancelada no tendrá valor para utilizarse en el futuro."
];

export const conditionsFlights: EmbeddedListItem[] = [
    {
        content: 'Los boletos de aerolíneas no son reembolsables y no se cambian, a menos que lo permitan los términos de la tarifa, y están sujetos a las normas de las aerolíneas, así como a las multas de las aerolíneas hasta el monto total de cada boleto, más las diferencias de tarifas en el caso de cambiar el boleto; y es posible que queden sujetos a los cargos que para el efecto pueda determinar Pichincha Miles®.',
    },
    {
        content: 'Ciertas aerolíneas pueden requerir que confirmemos la disponibilidad del vuelo al reservar. Si existe algún problema con la disponibilidad del vuelo, un representante de viajes se pondrá en contacto con el cliente en un plazo máximo de 24 horas para hacer arreglos alternativos sin costo adicional.',
    },
    {
        content: 'En algunos casos, una aerolínea puede emitir un crédito como alternativa al reembolso, de acuerdo con las normas sobre tarifas de cada boleto. En caso de que una aerolínea emita un crédito, esta lo retiene en nombre de la persona registrada como pasajero en la reserva original. Este crédito puede utilizarse para el pago de la reservación garantizada de un nuevo viaje, bajo las siguientes condiciones:',
        subList: conditionsFlightCredit,
    },
    {
        content: 'Las aerolíneas pueden imponer costos y tasas adicionales por concepto de equipaje, comidas, bebidas y demás servicios. Estos costos corren exclusivamente por cuenta del cliente.',
    },
    {
        content: 'Los boletos no utilizados no tendrán valor si no se cancelan antes de la fecha de salida programada.',
    },
    {
        content: 'Los boletos no pueden reasignarse ni transferirse a un pasajero o aerolínea diferentes.',
    },
    {
        content: 'Los horarios de los vuelos quedan sujetos a cambios por parte de la aerolínea. Pichincha Miles® no es responsable por los cambios de programación ni por notificar sobre dichos cambios. El cliente deberá confirmar la hora de salida programada al menos 48 horas antes en caso de vuelos nacionales y al menos 72 horas antes de la salida de vuelos internacionales, para conocer si la programación cambió.',
    },
    {
        content: 'Si no se utilizan las reservas, puede llevarse a cabo la cancelación automática de todas las reservas continuas y de retorno. En el caso de que los planes de viaje cambien mientras el cliente está en tránsito, deberá comunicárselo a su transportista.',
    },
    {
        content: 'El viajero deberá consultar con cada aerolínea los requisitos específicos de embarque y registro. Existe la posibilidad de que los vuelos de las aerolíneas estén completos o que no haya asientos disponibles en un vuelo para el cual tenga una reserva confirmada. En el caso de que esto ocurra, la aerolínea ofrecerá otras alternativas.',
    },
    {
        content: 'Es posible que haya un avión turbohélice en el itinerario. Las aerolíneas se reservan el derecho de cambiar los equipos de los aviones sin notificar sobre ello a la agencia de viajes que realizó la reservación garantizada ni al consumidor final.',
    },
    {
        content: 'Si hubiera un vuelo de código compartido en el itinerario (caso en el que dos o más aerolíneas comparten el mismo vuelo), los pasajeros deben registrarse en la aerolínea correspondiente el día de la salida.',
    },
    {
        content: 'No se garantizan asignaciones de asientos anticipadas, si estuvieran disponibles o si la línea aérea las permitiera. El viajero deberá consultar en la aerolínea acerca de sus tarjetas de embarque.',
    },
    {
        content: 'Para obtener información sobre las limitaciones de responsabilidad de la aerolínea, responsabilidad respecto del equipaje y otras reglamentaciones de la Convención de Varsovia, modificada por la Convención de Montreal, además de otras reglamentaciones, el pasajero debe consultar con su aerolínea.',
    },
];
