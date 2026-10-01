import { Disney, DisneyParams } from '../structure/disney';
import { parseDate } from './parseDateTime';

export function parseDisneyParamsToStructure(params: DisneyParams): Disney {
    const { adults, childrens, date } = params;

    return {
        adults: `adults=${adults}`,
        children: `children=${childrens}`,
        date: `date=${parseDate(date)}`,
    };
}
