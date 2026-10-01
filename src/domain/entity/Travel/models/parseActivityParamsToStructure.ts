import { Activity, ActivityParams } from '../structure/activity';
import { parseDate } from './parseDateTime';

export function parseActivityParamsToStructure(
    params: ActivityParams,
): Activity {
    const { destination, age, endDate } = params;

    return {
        destination,
        startDate: parseDate(endDate),
        endDate: parseDate(endDate),
        passengers: `passengers-${age}`,
        promoCode: '0',
    };
}
