import { injectable } from 'inversify';
import 'reflect-metadata';
import UltraviajesService from '@/domain/services/UltraviajesService';
import { TravelType } from '@/domain/entity/Travel/structure/travels';
import { ActivityParams } from '@/domain/entity/Travel/structure/activity';
import { parseActivityParamsToStructure } from '@/domain/entity/Travel/models/parseActivityParamsToStructure';

@injectable()
export default class GetActivitiesSearchUrlUseCase {
    execute(params: ActivityParams): string {
        const baseUrl = UltraviajesService.getBaseUrl(TravelType.ACTIVITIES);
        const { destination, startDate, endDate, passengers } =
            parseActivityParamsToStructure(params);

        return `${baseUrl}/activities/${destination}/${startDate}/${endDate}/${passengers}`;
    }
}
